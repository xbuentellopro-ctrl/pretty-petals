import React, { useState } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import AdminDashboard from "./AdminDashboard"
import SplashScreen from "./SplashScreen"
const pathname=window.location.pathname,hash=window.location.hash,globalFlag=window.__PRETTY_PETALS_ADMIN__;
const isAdmin=globalFlag||pathname.startsWith("/admin")||hash==="#admin"||hash.startsWith("#admin");
function Root(){
  const [showSplash,setShowSplash]=useState(!isAdmin);
  if(isAdmin)return <AdminDashboard/>;
  return(<>{showSplash&&<SplashScreen onDone={()=>setShowSplash(false)}/>}<App/></>);
}
ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><Root/></React.StrictMode>)
