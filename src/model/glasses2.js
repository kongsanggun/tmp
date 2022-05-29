/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Dokono Kinokoda (https://sketchfab.com/JunkWren)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/glasses-d25f2b7d0b094eea960e7b6c5277e60e
title: Glasses
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/model/glasses/glasses2/scene.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[Math.PI * (-0.5), 0, Math.PI * (0.5)]} position={[0, 0.05, 0]} scale={[0.073, 0.073, 0.065]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[14.99, 23.68, 57.69]} rotation={[-0.34, 0.08, 0.03]} />
            <mesh geometry={nodes.a_F05.geometry} material={materials.daz__F05} />
            <mesh geometry={nodes.a_F05_1.geometry} material={materials.daz__F05} />
            <mesh geometry={nodes.a_I05.geometry} material={materials.daz__I05} />
            <mesh geometry={nodes.a_B05.geometry} material={materials.daz__B05} />
            <mesh geometry={nodes.a_E08.geometry} material={materials.daz__E08} />
            <mesh geometry={nodes.a_A06.geometry} material={materials.daz__A06} />
            <mesh geometry={nodes.a_E04.geometry} material={materials.daz__E04} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/model/glasses/glasses2/scene.gltf')

export {Model}
