module.exports =  (req, res, next) => {
 
    try {

        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Basic ")) {
          let base64string = authHeader.split("Basic ")[1];
          let buffer = Buffer.from(base64string, "base64");
          let authString = buffer.toString("utf-8");

    
          if (authString) {
            const values = authString.split(":");
            const username = values[0];
            const password = values[1];
            
            req.user = {
                username,
                password
            };
           return next();
          } 
    
           res.status(401).json({
            message: "Invalid  missing token",
          });
        }
    
        res.status(401).json({
          message: "Invalid or missing token",
        });
        
    } catch (error) {
        
    }
  };