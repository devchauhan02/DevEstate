import React from 'react'

const SignIn = () => {
  return (
    <div>
      <h1 className="text-3xl text-center font-semibold my-7">SignIn</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 w-70 mx-auto">
          <input
            type="email"
            placeholder="Email"
            className="border border-slate-300 p-2 rounded-lg focus:outline-none"
            id="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-slate-300 p-2 rounded-lg focus:outline-none"
            id="password"
          />
          <button className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer">Sign In</button>
        </div>
      </form>
    </div>
  )
}

export default SignIn