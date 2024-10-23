
const PriceFormat = ({price}) => {
    return Intl.NumberFormat(["en-US",'bn-BD'], {
        style: "currency",
        currency:"BDT",
        maximumFractionDigits: 2,
        // maximumSignificantDigits:3,
        // currencyDisplay:'name',
        roundingIncrement:50,
        // roundingMode:"ceil",
        // roundingMode:"floor",
        
  }).format(price)
}

export default PriceFormat