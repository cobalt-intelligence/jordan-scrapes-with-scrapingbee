import axios from 'axios';
import dotenv from 'dotenv';
import cheerio from 'cheerio';
import HttpsProxyAgent from 'https-proxy-agent';
import fetch from 'node-fetch';

dotenv.config();

(async () => {
    // await ipAndSpeedCheck();

    // await scrapingFastPeopleSearch();

    // await scrapingArizona();

    await scrapingArizonaWithFetch();

    // await scrapingArizonaWithLuminati();
})();

async function ipAndSpeedCheck() {
    for (let i = 0; i < 5; i++) {
        // render_js is significantly slower
        console.time('scrapingBee time, with js');
        const axiosResponse = await axios.get('https://app.scrapingbee.com/api/v1', {
            params: {
                'api_key': process.env.scrapingBeeApiKey,
                'url': 'http://httpbin.org/anything?json',
                render_js: true,
                country_code: 'us'
            }
        });
        console.timeEnd('scrapingBee time, with js');

        console.log('axiosResponse', axiosResponse.data.origin, i);
    }

    // With render_js off
    for (let i = 0; i < 5; i++) {
        console.time('scrapingBee time, no js');
        const axiosResponse = await axios.get('https://app.scrapingbee.com/api/v1', {
            params: {
                'api_key': process.env.scrapingBeeApiKey,
                'url': 'http://httpbin.org/anything?json',
                render_js: false,
                country_code: 'us'
            }
        });
        console.timeEnd('scrapingBee time, no js');

        console.log('axiosResponse', axiosResponse.data.origin, i);
    }

    // Testing against normal speeds
    for (let i = 0; i < 10; i++) {
        console.time('normal time');
        const axiosResponse = await axios.get('http://httpbin.org/anything?json');
        console.timeEnd('normal time');

        console.log('axiosResponse', axiosResponse.data.origin, i);
    }
}

// FastPeopleSearch uses heavy bot detection and hCatpcha
async function scrapingFastPeopleSearch() {
    // With render_js off
    for (let i = 0; i < 10; i++) {
        console.time('scrapingBee time, no js');
        try {
            const axiosResponse = await axios.get('https://app.scrapingbee.com/api/v1', {
                params: {
                    'api_key': process.env.scrapingBeeApiKey,
                    'url': 'https://www.fastpeoplesearch.com/name/john-doe_biloxi-ms',
                    render_js: false,
                    premium_proxy: true,
                    country_code: 'us'
                }
            });
            console.timeEnd('scrapingBee time, no js');
            const $ = cheerio.load(axiosResponse.data);

            console.log('axiosResponse', $('h1').text(), i);
        }
        catch (e) {
            // ScrapingBee will throw a 500 when it hits the catpcha/403 error status
            console.log('e', e);
        }
    }
}

async function scrapingArizona() {
    for (let i = 0; i < 10; i++) {
        console.time('scrapingBee time, no js');
        try {
            const axiosResponse = await axios.get('https://app.scrapingbee.com/api/v1', {
                params: {
                    'api_key': process.env.scrapingBeeApiKey,
                    'url': `https://ecorp.azcc.gov/BusinessSearch/BusinessInfo?entityNumber=${23318062 + i}`,
                    render_js: false,
                    country_code: 'us'
                }
            });
            console.timeEnd('scrapingBee time, no js');
            const $ = cheerio.load(axiosResponse.data);

            console.log('axiosResponse', $('.data_pannel1').text().replace(/\n|\t|\s+/g, ''), i);
        }
        catch (e) {
            console.log('e', e);
            throw e;
        }
    }
}

async function scrapingArizonaWithFetch() {
    for (let i = 0; i < 5; i++) {
        console.time('scrapingBee time, no js');
        const url = encodeURIComponent('https://ecorp.azcc.gov/BusinessSearch/BusinessFilings');
        try {
            const response = await fetch(`https://app.scrapingbee.com/api/v1?api_key=${process.env.scrapingBeeApiKey}&url=${url}&render_js=false&country_code=us&forward_headers=true`, {
                'body': `businessId=${23318062 + i}&source=online`,
                'method': 'POST',
                'headers': {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-language': 'en-US,en;q=0.9',
                    'cache-control': 'max-age=0',
                    'content-type': 'application/x-www-form-urlencoded',
                    'sec-ch-ua': '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-user': '?1',
                    'sec-gpc': '1',
                    'upgrade-insecure-requests': '1',
                    'cookie': 'BNIS_STCookie=VMNwiEMrAsOr0J/Lqeu+FeoM8umOAyL0LF/g41FGmXyaql6DYONGicZIK4qJo/xeVbU2dsdwPNjkvoin3MjIdVxfkR/S6XxC; ASP.NET_SessionId=2evrbp50emib0cumtew3sdvs; BNI_persistence=VUpzTSDr1h_xUWFOwpCcVenx18NPntdyErONlshaxSQpM13CpbhUgwoI_7IExFz0B_PuqULhk4WB8vDW8Sa7UQ==; BNES_ASP.NET_SessionId=IGPaeSe2PJq5rDTOiuhrTEDptc8rNyoKYuRJ6ygdNFDmnGjisEmbd5SCUjzDvf9ehOwf1e6gxZ76pBTZGdEfdtbwuO7Sg8eESmdBCVW76Js=; __RequestVerificationToken=Ir1TQyyOUxCwDVJhg8RDLS94n5y5Ht1Kh6MThGeB6eDgxEV7Og9IgwqaCjmj_AFt3FQ-KeQL2zDTZHpP6WXFFQFjWWIGTf7ASD7LB-W3Rdw1; BNIS_x-bni-jas=qVkYtBFC4/NvkzqPXhnfL7D+rACbVpcu9/HnvxlQZmaMXbvR15LT072a2TuPpQJjCEpAY/Xg1ooRbavtU/93R52InI2fOfVYYB/6E7aIlF1ND2AzbW6bDA==; BNES___RequestVerificationToken=smQ6LD+akj+SxQVVV28MyZCynzxuYV4Ca2l09Ox9PoeKRPCVtDwKTn/HesJ3WQ+oUvH+m5YqGLUC3N3WcvcaukVjedhid0ttztz4Gh1YoSP9/6vNjlhIPoG60lkRGFqNWlTDNX4FgN8UF79UUQSU2PYIQ7raS+ZJGJ5cXS+1CqY4d353Cs4fvJsixBvs0kQzHlfl2XbQEoTC/MXLFZLyhQhfRMBOTJgE4f8GD2AIEXs=; x-bni-ja=1626405983',
                    'Referer': 'https://ecorp.azcc.gov/BusinessSearch/BusinessInfo?entityNumber=23113331',
                    'Referrer-Policy': 'strict-origin-when-cross-origin'
                }
            });

            const html = await response.text();
            console.timeEnd('scrapingBee time, no js');
            const $ = cheerio.load(html);

            console.log('axiosResponse', $('body').text().replace(/\n|\t|\s+/g, ''), i);
        }
        catch (e) {
            console.log('e', e);
            throw e;
        }
    }
}

async function scrapingArizonaWithLuminati() {
    const proxyAgent = new HttpsProxyAgent.HttpsProxyAgent(`https://${process.env.luminatiUsername}:${process.env.luminatiPassword}@zproxy.lum-superproxy.io:22225`);
    for (let i = 0; i < 100; i++) {
        console.time('luminati time, no js');
        try {
            const response = await fetch(`https://ecorp.azcc.gov/BusinessSearch/BusinessInfo?entityNumber=${23318062 + i}`, {
                'headers': {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
                    'cache-control': 'max-age=0',
                    'sec-ch-ua': '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'none',
                    'sec-fetch-user': '?1',
                    'upgrade-insecure-requests': '1',
                    'cookie': '_ga=GA1.2.278204924.1624631228; ASP.NET_SessionId=dzqatlvnbd02rstxv2hwkatd; BNI_persistence=VUpzTSDr1h_xUWFOwpCcVenx18NPntdyQGzFWtBWRI40fVE-6n3o4xNKHqRlt-0SBrVpYgc47YgPZ8A8Qz7Ibg==; BNIS_x-bni-jas=pRnhjYRp7IOvEGb5uJii9mjfu1KT04VFtQWzpTN3wrST7bqTwmYdGAMvArJ6QmCGsdU7grTBoZEOcCsuIMJq9a0Yoa9799UR/uO5PvaEeO9BZwih/u8JFg==; BNES_ASP.NET_SessionId=/nb8+Dd8+3vvv82N8upsnvxSd/fWb1WnUfmk3X53TUJDXuf0TObnrNV/Wf8WP75HENhNishCSrY294RGLrCESpN30V6AH4rWUdJXMIw3Hls=; _gid=GA1.2.1333252747.1625834691; x-bni-ja=761448704; __RequestVerificationToken=1q_S89yY3nYb2PN2JMo5CLa_I2yOYpD6gzCRWaNl_JvamE9gv9qMXuUqjcOUPWPaRhSNTyJwVdslwLlBpgfNBtMJiza3ppAqJDuDsbarnqc1; BNES___RequestVerificationToken=TgES1Gzgfv4wypjF+Rnjh5ldDdUQECoSdgUOIqwnzyX1gyfshzM4mB6+UmTnpV6zLwro2jfHQ1hEQfbdWb0lPZZ5NkA68ZQ0EZSnM0ZoduN54e1i4J8QbhSIbjyoyyEg0dvgjBmOGXrexquOPf2BuJ7kH86OeUF1qdd6Ia0G0UuEiGJdfgj3W7NXQF16xybyba3zQ/QVdU6jr4PnpyXT1EDaFrex7csdLiMRd7SNdjg='
                },
                'referrerPolicy': 'strict-origin-when-cross-origin',
                'body': null,
                'method': 'GET',
                'mode': 'cors',
                agent: proxyAgent
            } as RequestInit as unknown);
            console.timeEnd('luminati time, no js');
            const html = await response.text();
            const $ = cheerio.load(html);

            console.log('axiosResponse', $('body').text().replace(/\n|\t|\s+/g, ''), i);
        }
        catch (e) {
            console.log('e', e);
            throw e;
        }
    }
}