console.log("[sw.js]: sw register")
import {registerRoute} from 'workbox-routing';
import {ExpirationPlugin} from 'workbox-expiration';

import {StaleWhileRevalidate} from 'workbox-strategies';



registerRoute(
	({request, url}) => request.destination === 'image',
	new CacheFirst({
		cacheName: 'images',
		plugins: [
			new ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60 * 3, // 30 Days
			}),
		],
	}),
	request.destination === 'script' ||
			request.destination === 'style',
	new StaleWhileRevalidate({
		cacheName: 'static-resources',
	}),
	url.origin === 'https://eureka-imagineee-server.github.io/cdn',
	new StaleWhileRevalidate(),
	url.origin === self.location.origin &&
		url.pathname.startsWith('/js/', '/css/'),
	new StaleWhileRevalidate()
);