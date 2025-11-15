import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Vaihtoaktivaattori', // TODO: Change this when the final name has been decided
        short_name: 'Vaihtoaktivaattori',
        description: 'Platform for students interested in student exchange.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#FF5000',
        icons: [
            {
                src: '/app-icon-192x192.png', // TODO: Add icons to public folder and update paths. Currently using placeholders.
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/app-icon-256x256.png',
                sizes: '256x256',
                type: 'image/png',
            },
            {
                src: '/app-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            }
        ]
    }
}