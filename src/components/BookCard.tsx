import { Link } from "react-router-dom";

interface BookCardProps {
    id: string;
    title: string;
    image: string;
    price: string;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, image, price }) => {
    return (
        <div className="border p-4 rounded">
            <Link to={`/product/${id}`}>
              <img src={image} alt={title} className="w-full h-24 object-cover mb-2"/>
              <h2 className="font-bold">{title}</h2>
              <p>${price}</p>
            </Link>
        </div>
    )
}

export default BookCard