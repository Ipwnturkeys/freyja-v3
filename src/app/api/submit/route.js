import { NextResponse } from 'next/server';
const { google } = require('googleapis');

export async function POST(request) {

    // console.log(request);


    // Parse the incoming request body
    const obj = await request.json();

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
        credentials: {
            "type": "service_account",
            "project_id": "voidflare-d6f16",
            "private_key_id": "b037bbfd381bef2f8be7ab8de53deb8ea52892a7",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7O1GBPO5VTgm1\nLmexoVbyEpaOBhF5SX0Gkcg4hKLHzXSod1Gl7AGy0d34ZX/o2hLUh1sMxzFjsHRE\nun9XvRJfevCFyYX8gq+oKidIXsA8SEOUEYtZLIhqvIzptMdOVTFeeu9+BN3S9QeW\n6Ibh8rUJZrFV+RsY70obXSP/LkkHP255RVeRyovFyIjzUQVs+gaXlUUmwIhKAFk4\nv6FNnl17Ywt5ec1O1bhfHjNqRNtTrR541nw1O+zZcvbKFE9nY/W1LWWRh/tdJROZ\nmo41EVEFTbk8MmsmrOruHsoVRdWjTUS7vnrnqvOQKBamuIAxoF4u/kYQvAL9Dkwi\naGSJWE/JAgMBAAECggEAEyPyhluAAuT+LZE/pQNZI9ieHwlERomqeB41oX9/s5zP\nmPxPsr5ggxMc1cysiZWnmKX4uyLu6+HJVRBavdG0m+Gxzn+GTMTgZ7jdeLLFBLSf\ngfbUL8rTbFP3tNmYCWxApoe7TX76XVtSygzd4yHge4RNyzvy1vb5dLguGqN08EJR\nMlPzVnNyeKeFDN2l0x7nAiDtFIkIivy/06KPe54cWnEW1LehJ18+anOyFguKRnfu\n9fCvdSV1VgncGlYN6gWPSz4ciczkOpTXJ4JMRlybhg+va85enr/FTpxCoBOC9jkS\nEH7xQ+NpFb0HshOsXkhmnF14QTshqDWnE45v6/3/oQKBgQDpaGwqYBuLYEIqGHvv\nhvdR+xtHXqsqg2qY4ObHxOAOniyGNzs6T4+Yi72dQO2av/mHLPyVpqqVisW1QkCE\nMsRK2x7yvwbLfXe4cboga1AbUbEt34r8TbVCXAvywUywNG2aXHNOEmQAWsFEFNmW\ns1gzprAd+9+7zTBabcSd2wkueQKBgQDNWrQRY+Z3hesHKCS8wzOoWqR+Diguk1fd\n/7M1QFmpvGbpwmwzy8K8icBNV6gS9oZS7uYaajHVufuv2wZAJUErrROuomtn7e1P\nrebCzNNawly+RxBI/G5KPkaRqFsKLh2LuZgVKKBaklC62y6wGlxr9SKLXQ3DyZ0b\n/Kpx0/CX0QKBgQCgrPTBGxX7FVGW3vH6SwPYWK9Hq0DTbFImWbQk0z+WcIagAkdw\ndbKZRaFLLpYikIM67doXPvtxJG3DwI7fMn90NHGSk7Qewwl2XDvP82/azprUxG1O\nEER2IR1MiIq9Reopd/kcRoa2w8MFlgDPwDg4nkfg7DHxe2gM6EGQlWc1qQKBgG3p\nHzmzk5XjaoEBHnCdtddk9Ge3ohATstLSWhOlZpgvi5GQCyPJ6mfI/tEmmoHTyt82\nmJgIwLWY/roH65eHmRMMZt1wdzZAJWUhOcKHqJQKNWNuW6wE1+8K1/B8AIY5Wnz/\nkAO7I+B2MZlhWOLOqSrrIFshKg3hqiJhoMSd4EcRAoGBALG+svqSLbOFLwz7A2of\nn5W/OIqkgZ6EnsesBUPFKhvfQX0OS7FK9MwQWszzUemvIFPcIwNr42hQmhMpekr3\nb6PyzltWNE8EcpYtAndFq1mpnReKyXhv925agZPSV5aTSwsERIVHFBpS+9taFshU\nBGOmjkIk+rWNpZBq+UHvi/Bd\n-----END PRIVATE KEY-----\n",
            "client_email": "dexter@voidflare-d6f16.iam.gserviceaccount.com",
            "client_id": "113236881326747649334",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dexter%40voidflare-d6f16.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
          },
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
        ],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1W6XkuOa9a41yKQDeNobukOMw0w--42mI-neTmbDoSiI'; // Replace with your actual spreadsheet ID
    const range = 'Sheet1!A:E'; // Adjust based on your needs

    try {
        // Append the data to the spreadsheet
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[obj.moreData.amazonOrderId,
                    obj.moreData.email,
                    obj.moreData.firstName,
                    obj.moreData.lastName,
                    obj.moreData.phoneNumber,
                    obj.moreData.purchasedProduct,
                    obj.moreData.rating,
                    obj.address1,
                    obj.address2,
                    obj.city,
                    obj.state,
                    obj.zip,
                    obj.country,
                    obj.selectedProduct
                ]],
            },
        });

        return NextResponse.json({ message: 'Data submitted successfully' });
    } catch (error) {
        console.error('The API returned an error: ' + error);
        return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
    }
}

export async function GET(request) {
    // Do whatever you want
    return NextResponse.json({ message: "Hello World" }, { status: 200 });
  }