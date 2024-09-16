import React from 'react'
import Input from '../components/Input'
import { useState , useContext} from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../store/AuthContext'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'
const SignUp = () => {
    const [name , setName] = useState('')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')

	const {authState, setAuthState} = useContext(AuthContext);
    async function handleSignUp(e){
        e.preventDefault();
		
		setAuthState({...authState, loading:true})
        const user = {username : name , email, password}

		if (name==='' || password==='' || email===''){
			toast.error("Please Provide all credentials")
			setAuthState({...authState, loading:false})
			return;
		}

        const response = await fetch('http://localhost:5000/api/auth/signup' , {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(user)
        })
		

        const resJson = await response.json();
		if(resJson.error){
			toast.error(resJson.error)
			console.log(" error during signup ", resJson.error)
			setAuthState({...authState, loading:false})
			return;
		}
		toast.success("successfully signed up")
		console.log(" successfullly signed up :- ", resJson)
        setAuthState({...authState , uuid: resJson.id , loading: false})
    }
  return (
   <>
    <main className='w-full h-full flex justify-center items-center '>
        <div className=' h-3/4 w-1/3 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>

       
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mt-16'>
					Sign Up
				</h2>
        
        
        <div className='flex w-full  justify-center items-center mt-16'>
        <form onSubmit={handleSignUp}>
					<Input
						type='text'
						placeholder='Full Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className='flex w-full justify-center'>
					<Link to="/login" className='text-white' > Already Signed Up?</Link>
					</div>
                    {authState.loading === false ? <button
						className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
					
					>SUBMIT
					</button> : <Loader/>}
				</form>
        </div>
		
        </div>

    </main>
	
   </>
  )
}

export default SignUp