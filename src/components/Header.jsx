
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode')
}

function Header() {
  toggleDarkMode()

  return (

      <header class="header-container">

        <img src="src/assets/dark-icon2.png" class="toggle-button" onclick={toggleDarkMode}></img>  

        <div class="header-left">
          <a href="#" class="underline">Products</a>
          <a href="#" class="underline">Basket</a>
        </div>
        
        <a href="#">
          <img src="/src/assets/pfp.png" class="header-image"/>
        </a>

        <div class="header-right">
          <a href="#" class="underline">About</a>
          <a href="#" class="underline">Contact</a>
        </div>
        

      </header>

  )
}

export default Header