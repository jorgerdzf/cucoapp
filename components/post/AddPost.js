import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function App({ navigation }) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const TakePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
        }
    }
    const PickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };
    useEffect(() => {
        (async () => {
            const CameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(CameraStatus.status === 'granted');

            const GalleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(GalleryStatus.status === 'granted');

        })();
    }, []);

    if (hasCameraPermission === null || hasGalleryPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera or gallery</Text>;
    }
    return (
        <View style={styles.container}>
            <View style={styles.camera}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'1:1'}
                />
            </View>
            <Button
                title="Flip Camera"
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    );
                }}>
            </Button>
            <Button
                title="Take the shoot"
                onPress={() => TakePicture()}
            />
            <Button
                title="Pick image from gallery"
                onPress={() => PickImage()}
            />
            <Button
                title="Save"
                onPress={() => navigation.navigate('SavePost', {image})}
            />
            {
                image &&
                <Image source={{ uri: image }} style={{ flex: 1 }}></Image>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    image: {
        flex: 1
    }
}); 
