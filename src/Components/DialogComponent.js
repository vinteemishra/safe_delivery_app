// import React, { Component } from 'react'
// import {
//     TouchableOpacity,
//     View,
//     Image
// } from 'react-native'
// import AppText from './AppText';
// import ColorTheme from '../Constants/ColorTheme';

// export default class DialogComponent extends Component {
//     render() {
//         const { message, title, language, onNext, onClose } = this.props
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//                 <TouchableOpacity onPress={() => onClose()} style={{ backgroundColor: 'transparent', position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }} />
//                 <View style={{ width: '90%'}}>
//                     <TouchableOpacity onPress={() => onClose()} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 8 }}>
//                         <AppText style={{ backgroundColor: 'transparent', textAlign: 'right', color: ColorTheme.SECONDARY }}>{language.screen.close ? language.screen.close : 'close'}</AppText>
//                         <Image style={{ height: 16, width: 16, marginLeft: 8 }} source={require('../../img/notification_message/close.png')} />
//                     </TouchableOpacity>
//                     <View style={{ backgroundColor: ColorTheme.SECONDARY, }}>
//                         <View>
//                             {/* style={{ padding: 16, paddingTop: 24, }} */}
//                             <AppText style={{ fontWeight: 'bold', margin: 8 }}>{typeof title !== 'undefined' ? title : null}</AppText>
//                             <AppText style={{ flexWrap: 'wrap', margin: 8 }}>{message}</AppText>
//                         </View>
//                         <TouchableOpacity style={{ minHeight: 42, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: ColorTheme.PRIMARY}} onPress={() => onNext()}>
//                             <AppText style={{ color: ColorTheme.SECONDARY }}>{(language.screen.learn_more) ? language.screen.learn_more : 'Learn more'}</AppText>
//                             <Image style={{ height: 16, width: 24, marginLeft: 8 }} source={require('../../img/notification_message/arrow-right.png')} />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </View>
//         )
//     }
// }