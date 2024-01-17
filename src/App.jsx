import { createSignal, createEffect } from "solid-js";
import Test from "./components/Test"
import Header from "./components/Header"
import Products from "./components/Products";
import Footer from "./components/Footer";


function App() {
  return (
    <div class="app-container">
      <Header/>
      <Products/>
      <Footer/>
    </div>
  );
}

export default App;