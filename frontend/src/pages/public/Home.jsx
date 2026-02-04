import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import { Heart, Package, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      <div>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to My Pet Care+</h1>
            <p className="text-xl mb-8">Your trusted partner in pet care and wellness</p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/pets">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Browse Pets
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Heart className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Pet Adoption</h3>
                <p className="text-gray-600">Find your perfect companion from our wide selection of pets</p>
              </div>
              <div className="text-center">
                <Package className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-gray-600">Premium pet care products for all your pet's needs</p>
              </div>
              <div className="text-center">
                <Users className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
                <p className="text-gray-600">Professional veterinary care for your beloved pets</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Pets Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Pets</h2>
              <Link to="/pets" className="text-primary-600 hover:text-primary-700 flex items-center">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pet cards will be loaded from API */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <h3 className="font-semibold">Pet Name</h3>
                <p className="text-gray-600 text-sm">Breed</p>
                <p className="text-primary-600 font-bold mt-2">$Price</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Product cards will be loaded from API */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <h3 className="font-semibold">Product Name</h3>
                <p className="text-gray-600 text-sm">Category</p>
                <p className="text-primary-600 font-bold mt-2">$Price</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;

