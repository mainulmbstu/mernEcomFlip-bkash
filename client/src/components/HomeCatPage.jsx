import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'


const HomeCatPage = () => {
  let { category } = useAuth()
  
  let screen= window.screen.width

  return (
    <div className="row my-2">
      {category.length &&
        category.map((item) => (
          <div key={item._id} className="col-3 col-md-2 p-2 ">
            <div className='p-2'>
              <Link to={`products/category/${item?.slug}`} className=' text-decoration-none'>
                <img
                  src={
                    item.picture
                      ? `${import.meta.env.VITE_BASE_URL}/${item.picture}`
                      : `/placeholder.jpg`
                  }
                  // `${import.meta.env.VITE_BASE_URL}/${cat.picture }`
                  alt="image"
                  width={"100%"}
                  // height={400}
                  height={screen>768?150:50}
                />
              <p className=' text-center'>{item?.name} </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}

export default HomeCatPage