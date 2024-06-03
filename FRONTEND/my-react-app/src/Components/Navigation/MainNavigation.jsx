import React,{useState} from "react";
import { useRef } from "react";

import MainHeader from "./MainHeader";
import SideDrawer from './SideDrawer';
import "./MainNavigation.css";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import Backdrop from "../../UIElements/Backdrop";

const MainNavigation = (props) => {

const [drawerIsOpen,setDrawerIsOpen] = useState(false);

const openDrawerHandler = () => {
  setDrawerIsOpen(true);
}

const closeDrawerHandler = () => {
setDrawerIsOpen(false);
}

const myRef = useRef();

  return (
    <>
    {drawerIsOpen && <Backdrop onClick={closeDrawerHandler}/>}
    <SideDrawer myRef={myRef} show={drawerIsOpen} onClick={closeDrawerHandler}>
      <nav className="main-navigation__drawer-nav">
        <NavLinks/>
      </nav>
    </SideDrawer>
    
    <MainHeader>
      <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
        <span />
        <span />
        <span />
      </button>
      <h1 className="main-navigation__title">
        <Link>Your places</Link>
      </h1>
      <nav className="main-navigation__header-nav">
        <NavLinks/>
      </nav>
    </MainHeader>
    </>
  );
};

export default MainNavigation;
