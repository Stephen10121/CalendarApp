import { closeInternalAtom, errorAtom, globalLoadingAtom, loadingPopupAtom, slideUpAtom, slideUpBorderColorAtom, tokenAtom, userDataAtom } from "../store";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { validateUser } from "../functions/validateUser";
import LoadingIcon from "../components/LoadingIcon";
import PageRouter from "../components/PageRouter";
import Navigator from "../components/Navigator";
import SlideUp from "../components/SlideUp";
import PopDown from "../components/PopDown";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";

export default function Page() {
	const [ slideUpBorderColor, _setSlideUpBorderColor ] = useAtom(slideUpBorderColorAtom);
	const [ closeInternal, setCloseInternal ] = useAtom(closeInternalAtom);
	const [ loadingPopup, _setLoadingPopup ] = useAtom(loadingPopupAtom);
	const [ showSlideUp, setShowSlideUp ] = useAtom(slideUpAtom);
    const [ loading, setLoading ] = useAtom(globalLoadingAtom);
	const [ userData, setUserData ] = useAtom(userDataAtom);
	const [ error, _setError ] = useAtom(errorAtom);
    const [ token, setToken ] = useAtom(tokenAtom);

    const win = Dimensions.get('window');
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
		validateUser().then((data) => {
			if (data.error) {
				console.log("Login Failure");
				setLoading(false);
                router.push("/login");
                return
			}
            console.log("Login Success");
            setToken(data.token);
            setUserData(data.userData);
            setLoading(false);
		});
	}, []);

    useEffect(() => setLoading(!(token && userData)), [token, userData]);

    const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: '#fff',
			alignItems: 'center',
			justifyContent: 'center',
			position: "relative"
		},
		loading: {
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
			height: "100%"
		},
		body: {
		  height: win.height - 70,
		  width: "100%",
		  display: 'flex',
		  flexDirection: "row",
		  overflow: "hidden",
		  backgroundColor: "#dfdfdf"
		}
	});

    if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#3A9FE9" /></View>;

    return token && userData ?
		<>
            <View style={styles.body}>
				{error.show ? <PopDown message={error.message} type={error.type}/>: null}
				<PageRouter />
				{showSlideUp.show ? 
					<SlideUp fullHeight={true} closeInternal={closeInternal} border={slideUpBorderColor} close={() => {setShowSlideUp({...showSlideUp, show: false}),setCloseInternal(false)}} header={showSlideUp.header}>
					{showSlideUp.children}
					</SlideUp>
				: null}
            </View>
            <Navigator profilePic={userData?.picture} />
			{!!loadingPopup ? <LoadingIcon>{loadingPopup}</LoadingIcon> : null}
		</> : <View style={styles.loading}><ActivityIndicator size="large" color="#3A9FE9" /></View>;
}