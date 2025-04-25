# Interactive Map Application

A customizable Next.js application with Leaflet for creating interactive maps.

![Interactive Map Screenshot](/public/Screenshot.png)

## Features

- Interactive map with marker clusters
- Filterable user list with search functionality
- Responsive design for mobile and desktop
- Custom pin colors for different departments
- Accordion view for detailed user information
- Synchronized map and list views

## Getting Started

### Prerequisites

- Node.js (18.x or higher)
- npm or yarn

### Installation

1. Clone this repository

```bash
git clone https://github.com/your-username/interactive-map.git
cd interactive-map
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Configure your data

- Update the API endpoint in src/pages/index.js
- Customize marker icons in src/components/Map/DynamicMap.js
- Modify the data structure in getStaticProps function

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open http://localhost:3000 with your browser to see the result

## Customization Guide

Data Structure
The application expects user data with the following structure:

```bash
{
  data: [
    {
      attributes: {
        Name: "User Name",
        Category: "User Category",
        Role: "User Role",
        Departments: ["Department A"], // Array of departments
        Company: "Company Name",
        Location: "City, State",
        ProfileLink: "https://example.com/profile",
        Latitude: 39.8283, // Latitude for map marker
        Longitude: -98.5795, // Longitude for map marker
        Image: {
          data: {
            attributes: {
              url: "https://example.com/image.jpg"
            }
          }
        }
      }
    }
  ]
}
```

### Adding Custom Markers

1. Place your marker images in the public/images/ directory
2. Update the icon definitions in src/components/Map/DynamicMap.js
3. Update the departmentIcon mapping to match your departments

### Modifying Popup Content

Edit the createPopupContent function in src/components/MarkerCluster/MarkerCluster.js to customize the information displayed in map popups.

### Changing Filter Options

Modify the userDepartments array and related filter components in src/pages/index.js to customize the filter options available to users.

## Build for Production

```bash
npm run build
# or
yarn build
```

## Credits

This application is built with:

- [Next.js](https://nextjs.org/)
- [Leaflet](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org)
- [Bootstrap](https://getbootstrap.com/)
- [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
