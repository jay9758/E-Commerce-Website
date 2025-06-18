import React, { useEffect, useState } from 'react'
import { useFilter } from './FilterContext'
import { Tally3 } from 'lucide-react';
import axios from 'axios';
import BookCard from './BookCard';

const MainContent = () => {

    const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } = useFilter();

    const [products, setProducts] = useState<any[]>([]);
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const itemsPerPage = 12;

    // useEffect(() => {
    //     let url = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`

    //     // if (keyword) {
    //     //     url = `https://dummyjson.com/products/search?q=${keyword}`
    //     // }

    //     if (searchQuery) {
    //         url = `https://dummyjson.com/products/search?q=${searchQuery}`;
    //     } else if (keyword) {
    //         url = `https://dummyjson.com/products/search?q=${keyword}`;
    //     }

    //     axios.get(url)
    //     .then(response => {
    //         setProducts(response.data.products)
    //     }).catch(error => {
    //         console.error("Error fetching data", error);
    //     });

    // }, [currentPage, searchQuery, keyword]);

    useEffect(() => {
        let url = `https://dummyjson.com/products?limit=200`; // fetch ALL products

        axios.get(url)
            .then((response) => {
                setProducts(response.data.products); // store all products in state
                setCurrentPage(1); // reset to first page if filters change
            })
            .catch((error) => {
                console.error("Error fetching products", error);
            });
    }, []);

    const getFilteredProducts = () => {
        // let filteredProducts = products;
        let filteredProducts = [...products];

        if (selectedCategory) {
            filteredProducts = filteredProducts.filter(
                (product) => product.category == selectedCategory
            );
        }

        if (minPrice != undefined) {
            filteredProducts = filteredProducts.filter(
                (product) => product.price >= minPrice
            );
        }

        if (maxPrice != undefined) {
            filteredProducts = filteredProducts.filter(
                (product) => product.price <= maxPrice
            );
        }

        if (searchQuery) {
            filteredProducts = filteredProducts.filter(
                (product) => product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (keyword) {
            filteredProducts = filteredProducts.filter(
                (product) =>
                    product.title.toLowerCase().includes(keyword.toLowerCase()) ||
                    product.description.toLowerCase().includes(keyword.toLowerCase()) ||
                    product.category.toLowerCase().includes(keyword.toLowerCase())
            );
        }

        switch (filter) {
            case "expensive":
                return filteredProducts.sort((a, b) => b.price - a.price);
            case "cheap":
                return filteredProducts.sort((a, b) => a.price - b.price);
            case "popular":
                return filteredProducts.sort((a, b) => b.rating - a.rating);
            default:
                return filteredProducts;
        }
    };

    const filteredProducts = getFilteredProducts();

    // const totalProducts = 100;
    // const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    }

    const getPaginationButtons = () => {
        const buttons: number[] = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage - 2 < 1) {
            endPage = Math.min(totalPages, endPage + (2 - currentPage - 1));
        }

        if (currentPage + 2 > totalPages) {
            startPage = Math.min(1, startPage - (2 - totalPages - currentPage));
        }

        for (let page = startPage; page <= endPage; page++) {
            buttons.push(page);
        }

        return buttons;
    }

    return (
        <section className='xl:w-[55rem] xl:ml-[-2.5rem] lg:w-[55rem] sm:w-[40rem] xs:w-[20rem] p-5'>
            <div className='mb-5'>
                <div className='flex flex-col sm:flex-row justify-between items-center'>
                    <div className='relative mb-2 mt-5'>
                        <button className='border px-4 py-2 rounded-full flex items-center' onClick={() => setDropDownOpen(!dropDownOpen)}>
                            <Tally3 className='mr-2' />

                            {filter == 'all'
                                ? "filter"
                                : filter.charAt(0).toUpperCase() + filter.slice(1)
                            }

                        </button>

                        {dropDownOpen && (
                            <div className='absolute bg-white border border-gray-300 rounded mt-2 w-full sm:w-40'>
                                <button
                                    onClick={() => setFilter('cheap')}
                                    className='block px-4 py-2 w-full text-left hover:bg-gray-200'>
                                    Cheap
                                </button>
                                <button
                                    onClick={() => setFilter('expensive')}
                                    className='block px-4 py-2 w-full text-left hover:bg-gray-200'>
                                    Expensive
                                </button>
                                <button
                                    onClick={() => setFilter('popular')}
                                    className='block px-4 py-2 w-full text-left hover:bg-gray-200'>
                                    Popular
                                </button>
                            </div>
                        )}

                    </div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5'>
                    {paginatedProducts.length > 0 ? (
                        paginatedProducts.map(product => (
                            <BookCard
                                key={product.id}
                                id={product.id}
                                title={product.title}
                                image={product.thumbnail}
                                price={product.price}
                            />
                        ))
                    ) : (
                        <p className="text-black col-span-full text-center text-xl font-semibold py-10">
                            No products found.
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center mt-5">
                    {/* previous */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage == 1}
                        className='border px-4 py-2 mx-2 rounded-full'
                    >
                        Previous
                    </button>

                    {/* 12345 */}
                    <div className='flex flex-wrap justify-center'>
                        {getPaginationButtons().map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`border px-4 py-2 mx-1 rounded-full ${page == currentPage ? "bg-black text-white" : ""}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* next */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage == totalPages}
                        className='border px-4 py-2 mx-2 rounded-full'
                    >
                        Next
                    </button>
                </div>

            </div>
        </section>
    )
}

export default MainContent