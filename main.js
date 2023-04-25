import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

class Experience {
  constructor({ container }) {
    this.container = container
    this.scene = new THREE.Scene()

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    })
    this.renderer.setSize(this.width, this.height)
    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.01,
      10
    )
    this.camera.position.z = 1

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.clock = new THREE.Clock()
    this.time = 0

    this.addObjects()
    this.resize()
    this.render()
    this.addResize()
    this.addGUI()
  }

  addGUI() {
    this.gui = new dat.GUI()
    this.gui.add(this.material, 'wireframe')
  }

  addResize() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    })

    this.geometry = new THREE.PlaneGeometry(1, 1, 4, 4)

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  render() {
    this.time = this.clock.getElapsedTime()
    this.renderer.render(this.scene, this.camera)
    this.material.uniforms.uTime.value = this.time

    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Experience({
  container: document.querySelector('#webgl'),
})
