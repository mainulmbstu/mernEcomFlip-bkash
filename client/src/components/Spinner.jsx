import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const Spinner = () => {
  const [count, setCount] = useState(3)
  const navigate = useNavigate()
  const location=useLocation()
  
  useEffect(() => {
    let interval = setInterval(() => {
      setCount(prev=> --prev)
    }, 1000)
    count === 0 && navigate(`/login`, { state:location.pathname} )
    return ()=> clearInterval(interval);
  }, [navigate, count, location])
  

  return (
    <div>
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '80vh' }}>
        <h2 className=" mb-4">Redirecting to login in {count }</h2>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
