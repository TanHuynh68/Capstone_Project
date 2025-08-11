export interface PixabayPhoto {
    id: number;
    type: "photo" | "illustration" | "vector";
    webformatURL: string;
    largeImageURL: string;
    fullHDURL?: string;
    imageURL?: string;   // full API access
    vectorURL?: string;  // full API access
    tags: string;        // comma separated
    user: string;
    views: number;
    downloads: number;
    likes: number;
}

export interface PixabaySearchParams {
    q?: string;
    image_type: "all" | "photo" | "illustration" | "vector";
    colors?: string;
    lang?: string;
    orientation?: string;
    safesearch?: string;
    order?: string;
    per_page: number;
    page: number;
}

export interface PixabayResponse {
    totalHits: number;
    hits: PixabayPhoto[];
}

class PixabayService {
    private readonly API_KEY = "51725370-7ce504e1b108c0152ec33d4a0";

    // Multiple CORS proxy options for reliability
    private readonly CORS_PROXIES = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://thingproxy.freeboard.io/fetch/'
    ];

    async searchImages(params: PixabaySearchParams): Promise<PixabayResponse> {
        // Try each CORS proxy until one works
        for (const proxy of this.CORS_PROXIES) {
            try {
                const searchParams = new URLSearchParams({
                    ...params,
                    key: this.API_KEY,
                });

                const pixabayUrl = `https://pixabay.com/api/?${searchParams.toString()}`;
                const fullUrl = proxy + pixabayUrl;
                
                console.log(`🌐 Trying CORS proxy: ${proxy}`);
                
                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`Pixabay API error: ${response.status}`);
                }

                const data = await response.json();
                console.log(`✅ Success with proxy: ${proxy}`);
                return data;
                
            } catch (error) {
                console.warn(`❌ Proxy failed: ${proxy}`, error);
                continue; // Try next proxy
            }
        }
        
        // If all proxies fail, throw error
        throw new Error('All CORS proxies failed. Please try again later.');
    }

    // Alternative method for direct fetch (may work in some environments)
    async searchImagesDirect(params: PixabaySearchParams): Promise<PixabayResponse> {
        try {
            const searchParams = new URLSearchParams({
                ...params,
                key: this.API_KEY,
            });

            const url = `https://pixabay.com/api/?${searchParams.toString()}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Pixabay API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Direct fetch failed:', error);
            throw error;
        }
    }
}

export default new PixabayService();
