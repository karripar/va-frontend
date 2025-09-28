import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Vaihtoaktivaattori', // TODO: Change this when the name has been decided
        short_name: 'Vaihtoaktivaattori',
        description: 'Platform for students interested in student exchange.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#FF5000',
        icons: [
            {
                src: '', // TODO: Add icons to public folder and update paths
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '',
                sizes: '512x512',
                type: 'image/png',
            }
        ]
    }
}