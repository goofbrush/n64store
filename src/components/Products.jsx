import { createSignal, onCleanup, createEffect } from "solid-js";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc, getDocs } from 'firebase/firestore';


const defaultImage = "src/assets/dark-icon3.png"

let firebaseConfig;

if (import.meta.env.DEV) {
  firebaseConfig = JSON.parse(import.meta.env["VITE_FIREBASE_CONFIG"])
} else {
  firebaseConfig = JSON.parse(import.meta.env["FIREBASE_CONFIG"].replace(/^'/, '').replace(/'$/, ''));
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





// const exampleData = {
//   products: [
//     {
//       name: "Product 1",
//       category: "cat1",
//       variants: {
//         0: { name: "Var 1", price: 19.99, images: ["src/assets/v.png"], discount: 0, stock: 0, available: true, description: "" },
//         1: { name: "Var 2", price: 33.00, images: ["src/assets/pfp.png"], discount: 10, stock: 10, available: false, description: "aa" },
//         2: { name: "Var 2", price: 33.00, images: [], discount: 10, stock: 10, available: false, description: "aa" },
//       },
//     },
//     {
//       name: "Product 2",
//       category: "cat2",
//       variants: {
//         0: { name: "Var 1", price: 0.99, images: ["src/assets/pfp.png"], discount: 0, stock: 0, available: true, description: "bb" },
//         1: { name: "Var 2", price: 22.00, images: ["src/assets/OEMStick_V2_Red_V01-360x360.jpg"], discount: 30, stock: 40, available: false, description: "bb2" },
//       },
//     },
//   ],
// };


// const pushData = async () => {
//   try {
//     const productsCollection = collection(db, 'Products');
    
//     for (const product of exampleData.products) {
//       const productDocRef = doc(productsCollection);
//       await setDoc(productDocRef, product);
//     }

//     console.log('Data pushed to Firestore successfully');
//   } catch (error) {
//     console.error('Error pushing data to Firestore:', error);
//   }
// };




function Product({ product }) {

  function getPrice() {
    let lowest = 9999; let highest = 0;

    Object.keys(product.variants).forEach((key) => {
      lowest = (product.variants[key].price < lowest)? product.variants[key].price : lowest;
      highest = (product.variants[key].price > highest)? product.variants[key].price : highest;
    })
    
    if(lowest != 9999 && highest != 0) {
      return("£" + lowest + " - £" + ((highest == lowest)? "" : highest))
    }
    return "-"
  };


  let intervalId;
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);
  const [currentVariantIndex, setCurrentVariantIndex] = createSignal(0);
  const [isTransitioning, setIsTransitioning] = createSignal(false);


  const nextImageIndex = () => {
    return (currentImageIndex() + 1) % product.variants[currentVariantIndex()].images.length;
  }
  const nextVarientIndex = (currentVariant = currentVariantIndex()) => {
    const nextIndex = nextImageIndex();
    
    if(nextIndex === 0) {
      const nextVariant = (currentVariant + 1) % Object.keys(product.variants).length;
      if(product.variants[nextVariant].images.length === 0) {
        return nextVarientIndex(nextVariant);
      }
      return nextVariant;
    }
    return currentVariantIndex();
  }


  const updateImage = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      if(isTransitioning() == true) {
        let nextIndex = nextImageIndex();
        let nextVariant = nextVarientIndex();

        setCurrentImageIndex(nextIndex);
        setCurrentVariantIndex(nextVariant);
      }
      setIsTransitioning(false);
    }, 200);
  };

  const resetIndex = () => {
    clearInterval(intervalId);
    setCurrentVariantIndex(0);
    setCurrentImageIndex(0);
    setIsTransitioning(false);
  };

  const startAutomaticImageChange = () => {
    updateImage();
    intervalId = setInterval(() => { updateImage() }, 3000);
    onCleanup(() => clearInterval(intervalId));
  };


  return (
    <div class="product-item"
      onmouseenter={startAutomaticImageChange}
      onmouseleave={resetIndex}
    >
      <div class="image-container">
        <img
          src={product?.variants?.[currentVariantIndex()]?.images?.[currentImageIndex()] || defaultImage}
          class={`top ${isTransitioning() ? "fade-out" : "fade-in"}`}
        />
        <img src={product?.variants?.[nextVarientIndex()]?.images?.[nextImageIndex()] || defaultImage} />
      </div>
      
      <h3>{product.name}</h3>
      <h5>{getPrice}</h5>
    </div>
  );
}




function Products() {

  const [products, setProducts] = createSignal([]);

  createEffect(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Products"));
      const productsData = querySnapshot.docs.map((doc) => doc.data());
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  });

  return (
    <div class="page-body">
      <h2>Products</h2>
      {products().length > 0 ? (
        <div class="grid-container">
          {products().map((product)=>( <Product product={product} /> ))}
        </div>
      ) : (
        <p1>Loading...</p1>
      )}
      
    </div>
  );
}

export default Products


