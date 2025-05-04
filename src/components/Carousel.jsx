import {Slider} from "react-tech-slider";
 
export default function Carousel() {
  const marca = [
    {
      icon: "https://link-a-tu-imagen-1.com/logo.png",
    },
    {
      icon: "https://link-a-tu-imagen-2.com/logo.png",
    },
    {
      icon: "https://link-a-tu-imagen-3.com/logo.png",
    },
    {
      icon: "https://link-a-tu-imagen-4.com/logo.png",
    },
    {
      icon: "https://link-a-tu-imagen-5.com/logo.png",
    },
  ];
  
  return (
    <Slider 
      brandsList={marca}
      borderWidth={0}
      borderColor="#7c05d8"
      backgroundColor="#f1f5f9"
      iconWidth="4"
      pauseOnHover={false}
      speed={30000}
    />
  );
}