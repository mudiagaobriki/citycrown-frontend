import axios from "axios";

export async function getMovieByTitle(title){
    // eslint-disable-next-line no-useless-catch
    try{
        const res =  await axios.get(`https://ovokox@ovoko.com.ng/api/movies/name/${title}`)
        return res?.data
    }
    catch (e) {
        throw e
    }
}

export async function getFeaturedMovies(){
    // eslint-disable-next-line no-useless-catch
    try{
        const res =  await axios.get(`https://ovokox@ovoko.com.ng/api/featured-movies`)
        
        return res?.data
    }
    catch (e) {
        throw e
    }
}

export async function getFeaturedTVShows(){
    // eslint-disable-next-line no-useless-catch
    try{
        const res =  await axios.get(`https://ovokox@ovoko.com.ng/api/shows/featured-shows`)
        
        return res?.data
    }
    catch (e) {
        throw e
    }
}

export async function getTopRatedMovies(){
    // eslint-disable-next-line no-useless-catch
    try{
        const res =  await axios.get(`https://ovokox@ovoko.com.ng/api/toprated-movies`)
       
        return res?.data
    }
    catch (e) {
        throw e
    }
}

export async function getTopRatedTVShows(){
    // eslint-disable-next-line no-useless-catch
    try{
        const res =  await axios.get(`https://ovokox@ovoko.com.ng/api/show/toprated-shows`)
        
        return res?.data
    }
    catch (e) {
        throw e
    }
}

export async function getAllTopRated(){
    // eslint-disable-next-line no-useless-catch
    try{
        const topMovies = await getTopRatedMovies()
        const topShows = await getTopRatedTVShows()

        const res = [...topMovies?.data, ...topShows?.data]
        return res
    }
    catch (e) {
        throw e
    }
}

export async function getTrendingMovies(){
    // eslint-disable-next-line no-useless-catch
    try{
        const res =  await axios.get(`https://ovokox@ovoko.com.ng/api/trending-movies`)
        
        return res?.data
    }
    catch (e) {
        throw e
    }
}

export async function getTrendingTVShows(){
    // eslint-disable-next-line no-useless-catch
    try{
        const res =  await axios.get(`https://ovokox@ovoko.com.ng/api/show/trending-shows`)
        
        return res?.data
    }
    catch (e) {
        throw e
    }
}

export async function getAllTrending(){
    // eslint-disable-next-line no-useless-catch
    try{
        const topMovies = await getTrendingMovies()
        const topShows = await getTrendingTVShows()

        const res = [...topMovies?.data, ...topShows?.data]
        return res
    }
    catch (e) {
        throw e
    }
}
