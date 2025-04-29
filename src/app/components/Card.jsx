// src/app/components/Card.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Card({
  title,
  description,
  image,
  href,
  tags = [],
  className = '',
  ...props
}) {
  return (
    <div 
      className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-green-500/20 hover:border-green-500/50 ${className}`}
      {...props}
    >
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-800 text-green-400 px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        
        {description && (
          <p className="text-gray-400 mb-4">{description}</p>
        )}
        
        {href && (
          <Link 
            href={href}
            className="inline-flex items-center text-green-500 hover:text-green-400"
          >
            Daha fazla
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}