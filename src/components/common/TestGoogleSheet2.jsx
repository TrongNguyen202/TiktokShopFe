import { GoogleSpreadsheet } from "google-spreadsheet";
import axios from 'axios'
import { useEffect } from "react";

const TestGoogleSheet2 = () => {
    // const SPREADSHEET_ID = '1zo6it9m4wMeLJHg0JMIHuDMoHMiY2nFLbF6IlZo3qE8';
    // const SHEET_ID = 27189729;
    // const CLIENT_EMAIL = "test-tiktok@tiktok-shop-412204.iam.gserviceaccount.com";
    // const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCTSBoWul+bBA8p\nX5vj4RrQEeDHBr1WS7k/8td2tsrgYHYyk2LNNzm1ZezvJDYwPq99lE9imuGAdZKY\nI6JRGmsoI9Xy2SCWIAT84N82rkamVxCkgNxapgaKPHkUakQqV386ZB00fjypVJfg\npNP9PUgXQPCK7QOhLzHDGqCAlSr57RIZ5RZxMEtAIcLq0bnmE/fwrDBQ2bwrv2wa\nWAKTZ9FtOfwJdcKYSbOIutEj7/fvm2kTqDPkwbp7HM99vwhA4vaDeOse45f0IEAk\n5kCnbD4GK1YuVemamKRsOee+Owy9uQnwUFco8M1L58uOW88TBIvxTW8PNuECqXo4\n/6UvVf/TAgMBAAECggEAICpqEDap9KgBS67m0/DwsyqEZdMx/KvTDIVTy0iGrFRE\n3CzWMi1yfAyDn4LQFt9J4mpGoCllQHHtDy8RHxde+chBzKTg+giKLlRKS53qLh/r\nsZG3DlEeMoichPnkYz7yuWTt/+3l/7FK7jPxXGhK21FCd4Tl+wjcnFivXwW0+hoY\njDXel0nFjZ3Pjt1jeuDcAbADaRJfKHHp2JoEP8HlsqKQyBoomGwjcSjHixP3lef7\nboghs5AI4/Np8aQwWIGn4TVP23ZrJL9uxCrP2W0xEAKN7vgCYEkgAaohDuUmo2PM\n0SRD0DTBddJaPq5W9WvSRMBWGJ1q8K6L4SU09WrikQKBgQDPzdVrl08kcRvstDMT\nY9df8o1Eb0DV4vu3/9tws2rfkJy3EpC7rKG4Mfo61W/sP1bwEIPYPfZv21Kzcfnb\nFLk6aSwzUYmRFLZGM4IwRZtglkJhGocBLS+YiVwzFP9LgHDxecN0bNr+aB4O0N8+\nObwuLW/s2j1rVvhSs9gGtqGKKQKBgQC1cM8jirpp6M7DXhOr2hFmx2hb4X5spVux\nMl3czYJml9as7EDuDH/UnFeVruVNq/Jjd/HBOw32OJ5YREBWrFClv3Q+mAdv5Tdw\njROmIs2nmOAa18jNfGzsJIEv7glXz4ImN+UQTKVv+iqkPGlzyd54QvyrIW8VurCE\nsWccpRmxmwKBgQC4GJZWdvn6QuqGTS5iozUPH4bfdeBunGR8ogL6WTj5TthHp/7p\nBQtQb5ZLwQMivQp8K2VikaJdfmRJ7VN5L2bZxIsP+9Bv43WHw+I2ebQpYXT1Kdco\nx6s+65Hu/08cyHFGvKTX5AgvEnZukcT1D5kTH9Xkc4OuMKJWQlXDvNBn4QKBgQCp\n98iDggTJDAcNK0cAOOMORgTz9ZQqEOmJYCZfnsDmfJzlFthoZ5skP2Uo2lMCZO5G\n0ejN3BVjL3zeMOmYiAlwi55IuMBWyQIbVH0wp+/BbcuaOcRpAoNC35uJm9JyyPgh\n90CE+VgNQuvJOLKMfnICdLYfVc2rLF0JoOp4Ag3EuwKBgHhMWKEvLdSjvhdWkZTk\nH5TEQCSOymr9/4Dw15UvTR4OWj9sT3GhtdO0ONH6E2Uc125WARpzdWcIU2xboT31\nt5oPNGvDDnREF+dkfXmPc5Ws2Sk5AK1789nfP0UMZUw/7xsWvgeFg9THvyS5INXh\n7s0H1moOuj40KnBJ+phLSBHP\n-----END PRIVATE KEY-----\n";

    useEffect(() => {
        axios.get("https://content-sheets.googleapis.com/v4/spreadsheets/1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10/values/Team Dang?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING&key=AIzaSyDFxHGu-X0MhVT8LM3i-pMvVXCCotz2o6k").then((res) => console.log("res", res))
        axios.get("https://content-sheets.googleapis.com/v4/spreadsheets/1kzveL2qPN3MekbIZbz49j00snPwlj4U-uknKiFMWmNA/values/FlashshipVariant?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING&key=AIzaSyDFxHGu-X0MhVT8LM3i-pMvVXCCotz2o6k").then((res) => console.log("res", res))
    }, [])

    return (
        <>Hello</>
    );
}

export default TestGoogleSheet2;