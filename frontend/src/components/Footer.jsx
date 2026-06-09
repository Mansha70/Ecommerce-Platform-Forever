import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-5m'>
            <div>
                <img src={assets.logo} className='mb-5 w-32' alt="" />
                <p className='w-full md:w-2/3 text-gray-600'>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic similique adipisci labore consectetur pariatur voluptatibus illo laboriosam reiciendis ea laudantium. Incidunt ipsum quasi deleniti, eius adipisci aliquid ex culpa excepturi!
                </p>
            </div>
            <div>
               <p className='text-xl font-medium mb-5'>
                COMPANY
               </p>
               <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
               </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+1-2313131</li>
                <li>manshapandey2556@gmail.com</li>
                </ul>
            </div>
          
        </div>
        <div>
            <hr/>
            <p className='py-5 text-sm text-center'>Copyright 2026@forever.com-All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer