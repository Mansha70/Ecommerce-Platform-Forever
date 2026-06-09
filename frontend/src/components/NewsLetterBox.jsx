import React from 'react'

const NewsLetterBox = () => {
    const onSubmitHandler=(event)=>{
      event.preventDefault()
    }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
        <p className='text-gray-400 mt-3'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusantium quam repellendus, temporibus maxime voluptate nisi recusandae reprehenderit, necessitatibus, dolores ipsam ad minima aperiam delectus? Officia reprehenderit temporibus maiores itaque est.
        </p>
        <form  onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border-none pl-3'>
            <input  className='w-full sm:flex-1 outline-none'  type="email" placeholder='enter your email' required/>
            <button  className='bg-black text-white text-xs px-10 py-4' type='submit'>SUBSCRIBE</button>
        </form>
    </div>
  )
}

export default NewsLetterBox