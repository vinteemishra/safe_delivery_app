import { PermissionsAndroid } from 'react-native';

export async function requestLocationPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Cool Photo App Camera Permission',
                'message': `The location of the user is requested to 
                    help us understand what parts of the world are most 
                    in need of support when addressing issues related to 
                    maternal and neonatal mortality.`
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location")
        } else {
            console.log("Location permission denied")
        }
    } catch (err) {
        console.warn(err)
    }
}