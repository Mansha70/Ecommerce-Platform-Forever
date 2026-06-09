import jwt from 'jsonwebtoken'


const adminAuth=async(req,res,next)=>{
    try{
        const {token}=req.headers
        console.log("Token received:", token)
        console.log("ADMIN_EMAIL from env:", process.env.ADMIN_EMAIL)
        
        if(!token){
            console.log("No token provided")
            return res.json({
                success:false,
                message:"Please enter token"
            })
        }
        const token_decode=jwt.verify(token,process.env.JWT_SECRET)
        console.log("Decoded token:", token_decode)
        
        // Check if the decoded token's email matches the admin email
        if(token_decode.email !== process.env.ADMIN_EMAIL){
            console.log("Email mismatch:", token_decode.email, "vs", process.env.ADMIN_EMAIL)
            return res.json({
                success:false,
                message:"Not Authorized Login Again"
            })
        }
        console.log("Token verified successfully")
        next()

    }
    catch(error){
      console.log("Auth error:", error.message)
      res.json({
        success:false,
        message:error.message
      })
    }
}
export default adminAuth