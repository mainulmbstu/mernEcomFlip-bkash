/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet";

const Layout = ({
  children,
  title = "Ecommerce",
  description = "mern stack project",
  keyword = "mern, node, react, vite, mongoose, mongoDB, express",
  author = "Mainul Hasan",
}) => {
  return (
    <div>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keyword} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <main>{children} </main>
    </div>
  );
};





export default Layout;
