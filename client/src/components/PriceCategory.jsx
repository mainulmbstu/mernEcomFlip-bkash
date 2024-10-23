import { useSearch } from '../context/SearchContext';
import useStore from '../hooks/useStore';

const PriceCategory = () => {
  let { priceCategory} = useStore();
  let { setPriceCat } = useSearch();

  return (
    <div className=" d-flex flex-column col-2 px-2 pt-4 fs-4 border">
      <p className=' fw-bold mb-4'>Filter</p>
      {priceCategory?.map((item) => {
        return (
          <div key={item._id} className="mb-4">
            <input
              onChange={(e) => setPriceCat(e.target.value)}
              value={item.array}
              type="radio"
              name="kkk"
              id={item.name}
            />{" "}
            <label htmlFor={item.name}>{item.name}</label>
          </div>
        );
      })}
    </div>
  );
}

export default PriceCategory