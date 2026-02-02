// The main part of the app (app != desktop)

import { React } from "react"

import NavBar from "#components/NavBar";
import Welcome from "#components/Welcome";
import Dock from "#components/Dock";
import Terminal from "#windows/Terminal";
import Safari from "#windows/Safari";
import Resume from "#windows/Resume";
import Finder from "#windows/Finder";
import TextFile from "#windows/TextFile";
import ImageContentViewer from "#windows/ImageContentViewer";
import Desktop from "#components/Desktop";
import Contact from "#windows/Contact";

import gsap from "gsap";
import { Draggable } from "gsap/all";
import Photos from "#windows/Photos";




gsap.registerPlugin(Draggable)

const App = () => {
  return (
    <main>
      <NavBar />
      <Welcome />
      <Dock />
      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <TextFile />
      <ImageContentViewer />
      <Desktop />
      <Contact />
      <Photos />
    </main>
  )
}

export default App;