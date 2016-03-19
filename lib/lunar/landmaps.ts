/// <reference path="../../typings/global.d.ts" />

export class LandMaps{
    private static JWv = new Array(
'北京市 dshN天安门 dthS北京 dshe通州区 eDhD昌平区 e8hc顺义区 eJhc怀柔区 dihK大兴区 e8i7平谷区 eMho密云县 eSgw延庆县',
'河北省 c3fU石家庄 c2fn藁城市 btgD辛集市 c2g2晋州市 cKfe新乐市 c5fI鹿泉市 cFfC平山县 c2f8井陉县 brfd栾城县 c8fY正定县 cQfX行唐县 cIfM灵寿县 bafb高邑县 bjfk赵县 befN赞皇县 cBgC深泽县 cBfw无极县 bjfV元氏县 dbjB唐山 doj7丰润区 dYj7丰南区 eBiv遵化市 dyjg迁安市 e9jJ迁西县 dVjf滦南县 drii玉田县 dHjS唐海县 dPjt乐亭县 dijj滦县 duka秦皇岛 dgkA昌黎县 drjq卢龙县 drkE抚宁县 eJk4青龙满族自治县 aafS邯郸 agfC武安市 aZfW邯郸县 alfT永年县 alfv曲周县 aWgI馆陶县 aLfu魏县 aQfg成安县 aHg9大名县 aYee涉县 atfq鸡泽县 angA邱县 aTfu广平县 aXfm肥乡县 aKfa临漳县 aMfM磁县 b3fU邢台 bMgN南宫市 apfT沙河市 b4fU邢台县 bUff柏乡县 b7fe任县 b4gd清河县 bbft宁晋县 awgG威县 bLfk隆尧县 bQfU临城县 b4g9广宗县 aqgT临西县 bIfV内丘县 b4g1平乡县 bDg1巨鹿县 bWgF新河县 ayff南和县 cpgT保定 dTgw涿州市 cUfx定州市 cPgJ安国市 dJgp高碑店市 cvgJ满城县 cjgT清苑县 dOgg涞水县 cpfB阜平县 d1gd徐水县 dGgk定兴县 cifw唐县 cfgk高阳县 d3gq容城县 dLff涞源县 cgg8望都县 cog7完县 cugu安新县 dLgU易县 cbff曲阳县 cTgY蠡县 cRgS博野县 cwh5雄县 enfr张家口 eag2宣化县 fpfa康保县 f9fh张北县 e7fA阳原县 etgn赤城县 fegg沽源县 eefP怀安县 eOgV怀来县 exgG崇礼县 f5ew尚义县 dofY蔚县 eNgD涿鹿县 ejfh万全县 ewiu承德 ekj9承德县 ePiT兴隆县 fJii隆化县 f0jf平泉县 euiK滦平县 fChc丰宁满族自治县 fvii围场满族蒙古族自治县 eajT宽城满族自治县 cJhq沧州 c4hX泊头市 cgh5任丘市 cMiL黄骅市 cQh5河间市 cJhq沧县 cYhm青县 cBh7献县 brhV东光县 c8iU海兴县 c3iD盐山县 cPgn肃宁县 c2hg南皮县 bbhN吴桥县 c4i5孟村回族自治县 dVhf廊坊 d6hO霸州市 dxi5三河市 dQhG固安县 dKhT永清县 dkhy香河县 cghb大城县 cphR文安县 drhx大厂回族自治县 bigf衡水 bYgY冀州市 c0gW深州市 cFgi饶阳县 bUgh枣强县 bLgw故城县 bqh9阜城县 cEgV安平县 bmgr武邑县 bfhF景县 c3gx武强县',
'内蒙古 encd呼和浩特 eHc9托克托县 f6cR武川县 eMcn和林格尔县 dtce清水河县 ehc8土默特左旗 eeam包头 f2b3固阳县 fgbQ达尔罕茂明安联合旗 eXbV土默特右旗 eXbV萨拉齐镇 ffbQ百灵庙镇 deXm乌海 dUXg乌达区 gGjv赤峰 fakK宁城县 haj3林西县 fujg喀喇沁旗 hVje巴林右旗 gHks敖汉旗 hrl5阿鲁科尔沁旗 guk1翁牛特旗 hFiV克什克腾旗 hxkN巴林左旗 fZkK天义镇 ftjf锦山镇 gHks新惠镇 hql5天山镇 guk1乌丹镇 hFiU经棚镇 hxkN林东镇 hVje大板镇 hbnG通辽 jWkd霍林郭勒市 hamI开鲁县 i7oJ科尔沁左翼中旗 gvnL科尔沁左翼后旗 gimk库伦旗 gpld奈曼旗 iXls扎鲁特旗 i8oJ保康镇 gvnK甘旗卡镇 giml库伦镇 gold大沁他拉镇 iXls鲁北镇 dnax鄂尔多斯市 dnay东胜区 dcbq准格尔旗 cZZo乌审旗 dYaj伊金霍洛旗 d6Yx鄂托克旗 cBYS鄂托克前旗 dpZi杭锦旗 eOb1达拉特旗 nCkk呼伦贝尔 nDkh海拉尔区 nZiQ满洲里市 nHli牙克石市 lynj扎兰屯市 olmW根河市 oElA额尔古纳市 nJkQ陈巴尔虎旗 m7oS阿荣旗 mDjG新巴尔虎左旗 mdhn新巴尔虎右旗 oaoh鄂伦春自治旗 mSpU莫力达瓦达斡尔族自治旗 n8ki鄂温克族自治旗 nJkQ巴彦库仁镇 m7oS那吉镇 mDjG阿穆古郎镇 oaoh阿里河镇 mehn阿拉坦额莫勒镇 mSpU尼尔基镇 n8ki巴彦托海镇 ejYQ巴彦淖尔市 eiYQ临河区 f5ZG五原县 eKY1磴口县 erY9杭锦后旗 fYZV乌拉特中旗 ehZd乌拉特前旗 fQY0乌拉特后旗 eKXy巴彦高勒镇 erY9陕坝镇 fXZV海流图镇 f3e6乌兰察布市 f2e5集宁区 eRe8丰镇市 erer兴和县 esdY卓资县 fXeW商都县 eWdT凉城县 frf0化德县 fVcf四子王旗 eleC察哈尔右翼前旗 fGdc察哈尔右翼中旗 fReA察哈尔右翼后旗 fVcg乌兰花镇 ekeD土贵乌拉镇 fGdc科布尔镇 huh4锡林浩特市 hdcw二连浩特市 gBhS多伦县 i1fv阿巴嘎旗 iZib西乌珠穆沁旗 jVhx东乌珠穆沁旗 hpei苏尼特左旗 gjdd苏尼特右旗 frgH太仆寺旗 gIg0正镶白旗 gFh0正蓝旗 gEep镶黄旗 iZia巴彦乌拉镇 jVhw乌里雅斯太镇 hpeh满都拉图镇 gide赛汉塔拉镇 frgH宝昌镇 gFeo新宝拉格镇 k4n2兴安盟 k4n4乌兰浩特市 lIkp阿尔山市 jNmX突泉县 khnt扎赉特旗 jpnR科尔沁右翼前旗 j3mS科尔沁右翼中旗 cpWg阿拉善盟 coWe阿拉善左旗 dCSe阿拉善右旗 fwS4额济纳旗 dCSe额肯呼都格镇 fwS4达来呼布镇',
'山西省 bsdX太原 bpdY迎泽区 btdA古交市 c4de阳曲县 badK清徐县 c4cm娄烦县 e6eH大同 e2ea大同县 ePf5天镇县 dQfE灵丘县 eMei阳高县 e0dg左云县 dkfG广灵县 dgef浑源县 bpeX阳泉 bmea平定县 c5eO盂县 aBe6长治 aKeE潞城市 a3e3长治县 aWe3襄垣县 aJdr屯留县 aCeQ平顺县 aUeN黎城县 a7eC壶关县 a7dq长子县 aodq武乡县 ajdg沁县 aUdK沁源县 a3e3韩店镇 ZUdo晋城 Zmdt高平市 ZYds泽州县 ZfdA沁水县 ZleH陵川县 ZTdP阳城县 dJdP朔州 dVdn山阴县 dYeB应县 dxdS右玉县 dne5怀仁县 bgdi晋中 bfdi榆次区 b2ct介休市 b4dw榆社县 b5eM左权县 bKeY和顺县 bbef昔阳县 breA寿阳县 bPdX太谷县 bLdJ祁县 bCdA平遥县 aock灵石县 Z1bx运城 YqbQ永济市 ZZbg河津市 Yfbf芮城县 Z9bk临猗县 ZPbn万荣县 ZbcD新绛县 Zabw稷山县 ZLcC闻喜县 Z8cD夏县 ZTcY绛县 YocC平陆县 ZIcd垣曲县 cOdi忻州 cidi原平市 cTdv定襄县 cheF五台县 d4dv代县 dBeG繁峙县 cxdI宁武县 cLcu静乐县 d5dB神池县 csco五寨县 cgcY岢岚县 dNc8河曲县 d1c5保德县 dQcT偏关县 a5cU临汾 ZbcL侯马市 aYch霍州市 ZccS曲沃县 Zicg翼城县 ZqcQ襄汾县 aFce洪洞县 aGct古县 a9dF安泽县 Zwcp浮山县 a6be吉县 Zwbo乡宁县 aPc6蒲县 aSbi大宁县 akbc永和县 afbt隰县 adcY汾西县 bVc8吕梁市 bVc8离石区 b9cl孝义市 bGcl汾阳市 bQd1文水县 bKcB中阳县 cSc5兴县 bvbx临县 brcE方山县 bQbr柳林县 cHce岚县 axcB交口县 bXd9交城县 aybo石楼县',
'天津市 d8iC天津 diiI宝坻区 dNi4武清区 dKio宁河县 cuht静海县 e3iO蓟县',
'安徽省 VqiH合肥 WTiA长丰县 Vhi9肥西县 VriS肥东县 VKjM芜湖 V9jY芜湖县 UtjK南陵县 V5jC繁昌县 WuiK蚌埠 WviC怀远县 XJiJ固镇县 X8ir五河县 Wchx淮南 Wghh凤台县 VijT马鞍山 VXjT当涂县 Xvhj淮北 Xthl濉溪县 Uvil铜陵 UUi3安庆 V3hu桐城市 U9h7宿松县 UgiD枞阳县 UPhG太湖县 UPhd怀宁县 UphL岳西县 U7he望江县 UchY潜山县 ThjJ黄山 ThjH屯溪区 TljB休宁县 TqjQ歙县 Tpig祁门县 Tuiu黟县 WIjI滁州 Wfjy天长市 Wlix明光市 W6jG全椒县 WRjQ来安县 WWif定远县 WqiX凤阳县 Wsgn阜阳 XGgL界首市 X4gF临泉县 WchF颍上县 WcgZ阜南县 XAgb太和县 Xchy宿州 YChu萧县 XTir泗县 YQhK砀山县 XXiX灵璧县 Vhj6含山县 VIit无为县 VFiH庐江县 VhjM和县 VZig巢湖 VjhT六安 WZhl寿县 VOhJ霍山县 WKhG霍邱县 VRhu舒城县 Vfgq金寨县 Xqgk亳州 Xrgk谯城区 X8hC利辛县 XVhD涡阳县 XGhX蒙城县 UdiT池州 UdiT贵池区 U6i1东至县 UCiS石台县 Uciq青阳县 Uuji宣城 Uvji宣州区 Ubjx宁国市 UskP广德县 V8kB郎溪县 UfjO泾县 UHjW旌德县 U5jZ绩溪县',
'福建省 Q5kI福州 Q0kR马尾区 PikN福清市 PwkV长乐市 Q9k9闽侯县 QCkW连江县 QTkX罗源县 QDjq闽清县 Pqju永泰县 PUkl平潭县 ORj5厦门 OSix海沧区 OYj6集美区 Oij9同安区 PQk1莆田 PQk1莆田县 PMjf仙游县 PJk6秀屿区 OtjZ泉州 P7jr泉港区 Oijc石狮市 OnjY晋江市 OvjN南安市 P1jm惠安县 P4jB安溪县 PKjH永春县 PTjE德化县 OQjJ金门县 OVid漳州 OQin龙海市 NwiK云霄县 O7ib漳浦县 NgiA诏安县 Obij长泰县 NgiQ东山县 OUiM南靖县 OLiI平和县 OyiV华安县 QdjA南平 RKiT邵武市 Rjj2武夷山市 R2jJ建瓯市 RKj6建阳市 Rkj1崇安县 Qmim顺昌县 RtjW浦城县 RWiK光泽县 RWjk松溪县 RMjp政和县 P7i2龙岩 PHiO漳平市 P5h5武平县 PohL长汀县 Ohhh永定县 Phhj连城县 P3hP上杭县 QDia三明 PwiM永安市 QLiC明溪县 QAhn清流县 QGhe宁化县 Pgio大田县 QAjB尤溪县 QOil沙县 QhiR将乐县 QsiA泰宁县 Qoho建宁县 QekV宁德 R5kd福安市 RKlD福鼎市 Qrkx霞浦县 QZji古田县 Qtjw屏南县 RSkV寿宁县 R7kK周宁县 RFks柘荣县',
'江苏省 W5jm南京 W3jm玄武区 W2jm白下区 W1jm秦淮区 W2jk建邺区 W4jj鼓楼区 W6ji下关区 W7jg浦口区 W8jq栖霞区 Vyjk雨花台区 Vvjo江宁区 WLjo六合区 Vdk1溧水县 VKjq高淳县 VZlI无锡 VZlI崇安区 VYlI南长区 VZlH北塘区 VYlF滨湖区 VZlM锡山区 VflG惠山区 VslG江阴市 VMkn宜兴市 YGiB徐州 YFiD云龙区 YHiB鼓楼区 YIi8九里区 YRiR贾汪区 YFiB泉山区 YNjK新沂市 YJiu邳州市 YghZ丰县 Yiht沛县 YCiA铜山县 Xsiv睢宁县 Vlkv常州 Vlkv钟楼区 Vkkv天宁区 Vil3戚墅堰区 Vokw新北区 Viku武进区 VjkY金坛市 VPkT溧阳市 VIlZ苏州 VJla金阊区 VIlb沧浪区 VJlc平江区 VIlY虎丘区 VGlb吴中区 VLlb相城区 Vdli常熟市 VqlW张家港市 VNlv昆山市 VAlc吴江市 VRm6太仓市 Vxlr南通 W0lp崇川区 W2ln港闸区 Vnmd启东市 WOlX如皋市 W5m4通州市 Vsm9海门市 WXlR海安县 WJmA如东县 YakA连云港 YakA新浦区 YikM连云区 YYk8海州区 Yok7赣榆县 YVjk东海县 YIkF灌云县 Y6kL灌南县 Xbk1淮安 Xak0清河区 Xak2清浦区 XUk9楚州区 Xck2淮阴区 XkkG涟水县 XIjp洪泽县 X0jT盱眙县 X1k1金湖县 XLl9盐城 XOl8亭湖区 XLl8盐都区 WplJ东台市 XClR大丰市 YCkY响水县 Xyko滨海县 Xlkm阜宁县 XklF射阳县 XSkm建湖县 WNkQ扬州 WOkQ广陵区 WNkO邗江区 WPkO维扬区 WGkB仪征市 WlkQ高邮市 WQkX江都市 XEkJ宝应县 WCkQ镇江 WCkR京口区 WCkO润州区 W8kQ丹徒区 VykY丹阳市 WEkn扬中市 VukA句容市 WTks泰州 WUkt海陵区 WIkr高港区 Wuko兴化市 W1lF靖江市 WAl0泰兴市 WUl8姜堰市 XvjI宿迁 XwjF宿城区 XvjJ宿豫区 Y8jk沭阳县 Xhje泗阳县 XRjC泗洪县',
'江西省 Sfgs南昌 SXgu南昌县 Sfgn新建县 SpgX安义县 SMhG进贤县 TCi7景德镇 Swi7乐平市 TNiE浮梁县 Rceo萍乡 R8ev莲花县 Rrem上栗县 Rcf2芦溪县 Thgx九江 Tfgd瑞昌市 Tbgr九江县 TGg6武宁县 T2fY修水县 T3gn永修县 TKgj德安县 TRh2星子县 TGhB都昌县 TihD湖口县 TshX彭泽县 Rmfu新余 Rnff分宜县 SFi2鹰潭 SHiC贵溪县 SChn余江县 Ppfu赣州 Pqh1瑞金市 Pefj南康市 Pqg0赣县 PNfu信丰县 POfL大余县 PmfW上犹县 PgfI崇义县 P8gO安远县 Osfl龙南县 Okg1定南县 OjfV全南县 QSh1宁都县 PvgP于都县 QJgL兴国县 PZgl会昌县 Ovgc寻乌县 QKhK石城县 R6fw吉安 QYfA井冈山市 R2fs吉安县 RDg8吉水县 RXg9峡江县 RkgO新干县 RJgQ永丰县 QKfU遂川县 Qmfs泰和县 QSfl万安县 RNfb安福县 QvfE永新县 RmfM宜春 SCgl丰城市 S4gW樟树市 SQgM高安市 SggN奉新县 S7fR万载县 SEfu上高县 SOfl宜丰县 SqgL靖安县 SVfL铜鼓县 RuhI临川区 RYhc南城县 RIht黎川县 RDhW南丰县 Rjh4崇仁县 RQgo乐安县 RXhD宜黄县 Rthl金溪县 Rgi4资溪县 SEha东乡县 QohJ广昌县 SRiw上饶 SviZ德兴市 SQis上饶县 SQjB广丰县 SfjE玉山县 SIig铅山县 SPia横峰县 SOiP弋阳县 Sfhf余干县 Syhe波阳县 Sgi4万年县 TFip婺源县',
'山东省 adhw济南 aXhi长清区 ahiV章丘县 aHhQ平阴县 awiD济阳县 bIi9商河县 ahiV明水街道 a5lL青岛 aHl0胶州市 aNlS即墨市 alku平度市 Zrkx胶南市 aplV莱西市 aplW水集街道 amj3淄博 anio周村区 aTip博山区 aciv淄川区 alj4张店区 awj6桓台县 bAin高青县 aBjA沂源县 avj6索镇 aBjA南麻镇 YqiX枣庄 YmiG薛城区 YkiZ峄城区 Z5iR山亭区 YXij台儿庄区 Z5i9滕州市 YaiM韩庄 bRjS东营 bUjF利津县 bZjW垦利县 b3jO广饶县 bXmM烟台 bYmL芝罘区 bUmF福山区 bNmZ牟平区 bdlK龙口市 awlg莱阳市 bAkv莱州市 bmlj蓬莱市 bLlO招远市 bIlp栖霞市 akmA海阳市 btli长岛县 agk6潍坊 akkD寒亭区 afjT青州市 ZykO诸城市 arji寿光县 aQkC安丘市 aNkj高密市 apkO昌邑市 agjn昌乐县 aVjW临朐县 bUn7威海 bBn3文登市 asmV乳山市 bAnO荣城市 ZOhZ济宁 ZZhx曲阜市 ZXhn兖州市 ZOhv邹城市 Yyhd鱼台县 Z4hI金乡县 ZOhK嘉祥县 Ymi7微山县 ZihT汶上县 ZdiG泗水县 Zlh6梁山县 Yxhd谷亭镇 aBi8泰安 Zsik新泰市 aEhk肥城市 Zjhl宁阳县 ZthI东平县 ZPkR日照 ZjkC五莲县 ZZjn莒县 aBie莱芜 Z3jK临沂 ZXjS沂南县 YbjK郯城县 Zljc沂水县 Ypj3苍山县 ZGiv费县 ZUic平邑县 ZBjn莒南县 Zgiu蒙阴县 Ytjd临沭县 ZXjR界湖镇 Ypj3卞庄镇 ZAjo十字路镇 bRhH德州 biiC乐陵市 avhd禹城市 bKhY陵县 bdhl宁津县 bliN庆云县 bBhp临邑县 amhj齐河县 bAhQ平原县 avh0夏津县 bDh4武城县 amhi晏城镇 aRgw聊城 apgg临清市 a7gl阳谷县 aEge莘县 aZhE茌平县 aKhE东阿县 aSgQ冠县 aqhE高唐县 aJhE铜城镇 bMj1滨州 bTiU惠民县 bciZ阳信县 biia无棣县 bgj8沾化县 b8j8博兴县 arii邹平县 bgj8富国镇 ZEgQ菏泽 YogW曹县 Ymh5单县 Yvgq成武县 ZNh5巨野县 Zagu郓城县 ZYgU鄄城县 Z4gY定陶县 ZHg6东明县',
'上海市 VEmS上海 VPmT宝山区 VBmg川沙县 VNmF嘉定区 VEmU浦东新区 Usm9金山区 V1mE松江区 V9m6青浦区 V3mj南汇区 UtmR奉贤区 VcmN崇明县',
'浙江省 SemQ椒江 SRms大陈镇 SdmF黄岩 SXmF院桥镇 SYmC沙埠镇 Sbm6北洋镇 Scm9头陀镇 Scm0屿头镇 SZlw宁溪镇 SZmM路桥 SUmV金清镇 SXmT蓬街镇 SVmP新桥镇 SWmQ横街镇 Som6临海 SkmU杜桥镇 Ssls白水洋镇 SmmA汛桥镇 SomZ桃渚镇 SumG东塍镇 SkmE沿江镇 Splx扩苍镇 SkmJ涌泉镇 SpmR小芝镇 SjmZ上盘镇 Sim6尤溪镇 Sym6河头镇 Srm5永丰镇 SumD汇溪镇 ShmJ红光 SvmD两头门 SjmE水家洋 SMmL温岭 SUmM泽国镇 SSmQ新河镇 SKmP城南镇 SKma松门镇 SOmV箬横镇 SLmR石桥头镇 SGma石塘镇 SJmX木耳 SImQ沙岙 SHma箬山 SLmY淋头 S7mD玉环 S8mE珠港镇 SDmI楚门镇 SFmH清港镇 SEmN沙门镇 S5m9大麦屿镇 SCmE芦浦镇 SAmL干江镇 S5mG坎门 T8m1天台 T7mM三门县 T8mM海游镇 T9mO沙柳镇 T4mH珠岙镇 T3mL亭旁镇 T5ma六敖镇 T0mT横渡镇 T3mb健跳镇 Swmb浬浦镇 StmT花桥镇 SrmY小雄镇 Spli仙居 SilW皤滩 SemP台州 UFlA杭州 UAlG萧山区 UPlI余杭区 TTkH建德市 U4kv富阳市 UEkh临安市 Tmkd桐庐县 Tbk2淳安县 UHku余杭镇 TqmX宁波 TqmY鄞州区 Tvmi镇海区 U3m9余姚市 UBmE慈溪市 TemP奉化市 THmP宁海县 TTmr象山县',
'黑龙江省 jjrb哈尔滨 jbrd平房区 jxra呼兰区 jWrJ双城市 kIuX依兰县 joto方正县 jvt3木兰县 jwtj通河县 jRtK延寿县 jgro成高子镇 jDsv尚志 jGsV帽儿山镇 iutb亚布力镇 j4t4一面坡镇 ivtN苇河镇 iutk鱼池朝鲜族乡 iusA五常 ilsF山河屯镇 jWrw阿城市区 jTs4亚沟镇 jOsA玉泉镇 jKsI小岭镇 jLs5交界镇 jls0永源镇 jjs9蜚克图镇 jcs3料甸满族乡 jYs7红星乡 jJsO平山镇 jOsQ山河镇 jjsT宾县(宾州) jjsA宾西镇 jksH居仁镇 josj宾安镇 jts4糖坊镇 jXsS松江镇 jist宁远镇 jmt3胜利镇 jtsn新甸镇 kQs7兴隆镇 k5sN巴彦 lLow齐齐哈尔 l9om昂昂溪区 lCob富拉尔基区 lUnr碾子山区 mTpr讷河市 lKoB龙江县 lrqI依安县 kNoP泰来县 ltoU甘南县 llpR富裕县 m1qq克山县 m2rF克东县 lar5拜泉县 jHvw鸡西 jIvw鸡冠区 j5vf梨树区 jCvs恒山区 jMvm滴道区 jKw4城子河区 juyi虎林市 jWwq密山市 jFwA鸡东县 lKvH鹤岗 lYvo萝北县 lHwp绥滨县 kcw9双鸭山 kZwK四方台区 kYw8岭东区 kYwO宝山区 khw8集贤县 kKxC宝清县 kmz1饶河县 knwE福利屯 khw8福利镇 kaq1大庆 kaq2萨尔图区 kXq7龙凤区 kdpq让胡路区 kSpq红岗区 jVq5肇源县 jgqG肇州县 lBpq林甸县 kqpQ杜尔伯特蒙古族自治县 kZq3东水源泡 kaq4东风泡 lhts伊春 l8uH南岔区 lqto友好区 lUuI西林区 lhte翠峦区 lbu7美溪区 lOuQ金山屯区 lhtm乌马河区 l1u1带岭区 kxt4铁力市 muv3嘉荫县 kmvM佳木斯 ldxT同江市 lFx1富锦市 kDvW桦南县 l1vg桦川县 khus汤原县 mMzI抚远县 kivS长发镇 kqvI莲江口镇 kevZ横头山镇 kpv9望江镇 jmvo七台河 jjvY勃利县 iZub牡丹江 itvV穆棱市 iOw8绥芬河市 iYuN海林市 iKuS宁安市 i3w7东宁县 jHvG林口县 itvX八面通镇 iVvG穆棱镇 iavK兴源镇 iYuq磨刀石镇 ifvR下城子镇 ifvW马桥河镇 iPvr绥阳镇 iZu6山市镇 iTtt长汀镇 iPu7新安朝鲜族乡 ikuf柴河镇 inu4横道河子镇 i7uC东京城镇 iGuO兰岗镇 iBuK石岩镇 i7u9渤海镇 iAtw沙兰镇 i1wF三岔口朝鲜族镇 ifuf桦林镇 iZuf铁岭镇 iQuT温春镇 oFsT黑河 oDsW爱辉区 mErV北安市 nAqE嫩江县 nYtS逊克县 nPsJ孙吴县 kcrx绥化 kOqJ安达市 k4qx肇东市 lRrv海伦市 korT望奎县 kGrH兰西县 kfr6青冈县 kqsV庆安县 lBqs明水县 lFs6绥棱县 oQp8大兴安岭地区 oPp7加格达奇区 phrd呼玛县 qKph塔河县 rTnK漠河县',
'吉林省 hqqL长春 hVqe双阳区 i9qo九台市 inrX榆树市 iWqg德惠市 iPqB农安县 hprY吉林 iOrv舒兰市 gwrj桦甸市 hhsK蛟河市 gur4磐石市 herU永吉县 hApM四平 hUpn公主岭市 hVoU双辽市 hIpJ梨树县 hKqI伊通满族自治县 gsq8辽源 gtpx东辽县 geqV东丰县 fhqu通化 gWqf梅河口市 f7rB集安市 gfr2辉南县 ffqj通化县 gGqi柳河县 furP白山市 gNrm靖宇县 gKsG抚松县 fPtC长白朝鲜族自治县 jbno白城 jKnk洮南市 jUpH大安市 jpoC镇赉县 imo5通榆县 jBpm松原市 jApn宁江区 jApq扶余县 iGox长岭县 iyp1乾安县 j7pn前郭镇 guuU延边州 gsuV延吉市 gwuo图们市 hMtE敦化市 gkuP龙井市 gqvM珲春市 gXu1和龙县 h6tt安图县 hJui汪清县',
'辽宁省 fmoN沈阳 fnoY东陵区 feoL苏家屯区 fxnn新民市 fUni辽中县 gUoO法库县 gioL康平县 cvmZ大连 cmmF旅顺口区 d6mh金州区 dbn0瓦房店市 dOmw普兰店市 dfnw庄河市 dGnZ长海县 dCmu亮甲店镇 dGmm三十里堡镇 f7nx鞍山 epnj海城市 fNnQ台安县 eHoH岫岩满族自治县 f4no腾鳌镇 fqos抚顺 fqov抚顺县 g6pt清原满族自治县 fhq2新宾满族自治县 fIok本溪 fIp7本溪满族自治县 fFqL桓仁满族自治县 e7pL丹东 dqp9东港市 eSp4凤城市 eipl宽甸满族自治县 drp9大东街道 e2pK浪头镇 f7m9锦州 fAmL凌海市 faml北镇市 ffn7黑山县 fWmF义县 faml广宁街道 fBmL大凌河街道 fan9大虎山镇 fMml沟帮子镇 g0nA新立屯镇 fWmF义州镇 efnH营口 eOnM盖州市 ecnU大石桥市 g1md阜新 gNnW彰武县 g4mi阜新蒙古族自治县 fGoA辽阳 fPoJ灯塔县 fCo4辽阳县 fBn3盘锦 eyn4大洼县 fCn3盘山县 gHoo铁岭 gSoW调兵山市 gWp2开原市 gIop铁岭县 giph西丰县 gkp8昌图县 fZlR朝阳 fnlk北票市 fEkO凌源市 falP朝阳县 fOkd建平县 f8ki喀喇沁左翼蒙古族自治县 fOkc叶柏寿街道 f7ki大城子镇 eilp葫芦岛市 eblg兴城市 eJlL绥中县 emkm建昌县',
'广东省 N7eG广州 MveM番禺区 NNeC花都区 NIeo增城市 NXeZ从化市 MXf7深圳 MZer宝安区 MGeY珠海 MDeH斗门区 NLhf汕头 NGha潮阳区 NShk澄海区 NQi1南澳县 OmeZ韶关 Ofea曲江区 P8eL乐昌市 P7fI南雄市 Ovf4始兴县 P5ej仁化县 OLf8翁源县 O4fC新丰县 OleG乳源瑶族自治县 N2e7佛山 MpeF顺德区 NAdr三水区 Mrdp高明区 MZe5江门 MWe2新会区 MFdm台山市 MNdf开平市 Mkdv鹤山市 MCdI恩平市 Lebr茂名 Ltbp高州市 Ldbc化州市 MMbu信宜市 LVc0电白县 LBbN湛江 LbbH廉江市 Ksb5雷州市 LRbl吴川市 LNbF遂溪县 KKbA徐闻县 N3dR肇庆 N3dR高要市 NLdg四会市 NddQ广宁县 NtdB怀集县 NRcU封开县 N9ck德庆县 N6fO惠州 MmfS惠阳区 NAfH博罗县 Mxfh惠东县 NifF龙门县 OJh7梅州 O8gi兴宁市 OIh7梅县 OLhf大埔县 NkhA丰顺县 Nugk五华县 OYgr平远县 OdhA蕉岭县 MkgL汕尾 Mvgc陆丰县 MxgK海丰县 NJgd陆河县 Niff河源 NdgA紫金县 O6gF龙川县 OLfT连平县 OQfu和平县 Lpcv阳江 MBcl阳春市 Ljcc阳西县 Nhe1清远 OAeO英德市 OldN连州市 NqeW佛冈县 OTdc阳山县 OYd4连山壮族瑶族自治县 OhdH连南瑶族自治县 N3ei东莞 MWeM中山 Nehc潮州 Nfi0饶平县 NWhL揭阳 NIhA普宁市 NQgo揭西县 N2hH惠来县 Mud2云浮 MkcY罗定市 MgdE新兴县 NFcV郁南县',
'广西壮族 MmZJ南宁 MjZT邕宁区 NAZH武鸣县 NBYf隆安县 NhZA马山县 NRZZ上林县 NDZn宾阳县 MgaG横县 OJaO柳州 OFaK柳江县 OdaE柳城县 OTai鹿寨县 PDaN融安县 P4aF融水苗族自治县 Plaa三江侗族自治县 PHbH桂林 OlbT阳朔县 PEbC临桂县 PPbJ灵川县 Ocbd平乐县 Pbbe兴安县 PTc9灌阳县 OUbN荔浦县 Q2bc资源县 Oxax永福县 Pmb1龙胜各族自治县 Oobn恭城瑶族自治县 NTcI梧州 Muc0岑溪市 NPcE苍梧县 NMbs藤县 OCbV蒙山县 LTa7北海 LeaB合浦县 LkZL防城区 M9Yx上思县 OPcW贺县 OWcI钟山县 OAbm昭平县 OncG富川瑶族自治县 NiaE来宾 NmZq合山市 Nvaf象州县 Naad武宣县 O4Ze忻城县 O8bB金秀瑶族自治县 N6ab贵港 NOb4桂平县 NXbO平南县 Mcb8玉林 MhbL北流市 MqbX容县 MKbG陆川县 MHaw博白县 NsXb百色 OLXZ凌云县 NJYY平果县 OUW5西林县 OmXY乐业县 NKXb德保县 OIXE田林县 NiXt田阳县 N9XP靖西县 NaY7田东县 NPWo那坡县 OlWK隆林各族自治县 OgZ3河池 OTZd宜州市 P1Y9天峨县 OXY3凤山县 OxYW南丹县 OVYM东兰县 NuZ6都安瑶族自治县 OlZs罗城仫佬族自治县 O9YF巴马瑶族自治县 OoZF环江毛南族自治县 NjYx大化瑶族自治县 LvZb钦州 MQaH灵山县 MGaW浦北县 MPYL崇左 M8Y4宁明县 MdYs扶绥县 MLXp龙州县 MoYC大新县 N5Y8天等县',
'海南省 K2bL海口 K0bL琼山区 IEaU三亚 Jbbj文昌市 JFbS琼海市 ImbO万宁市 J6Zc东方市 IkaV五指山市 JVaZ儋州市 Jtaf临高县 Jib1澄迈县 JgbJ定安县 JMb6屯昌县 JGa3昌江黎族自治县 JEaR白沙黎族自治县 J3ao琼中黎族苗族自治县 IUb2陵水黎族自治县 Icag保亭黎族苗族自治县 IjaA乐东黎族自治县',
'河南省 Yked郑州 YneH上街区 YOeh新郑市 YleN荥阳市 YWeN新密市 Yjdx巩义市 YRe2登封市 Yif1中牟县 YlfK开封 YXfl杞县 YSfS通许县 YPfB尉氏县 Ynfn兰考县 YedM洛阳 YbdS洛龙区 Ysda吉利区 Yidk偃师市 YodQ孟津县 Yid8新安县 Xlcb栾川县 Y8d5嵩县 Y9dS汝阳县 YVdA宜阳县 YNcd洛宁县 YPdP伊川县 XieI平顶山 XHeT舞钢市 YAdo汝州市 Xqe4宝丰县 XbeL叶县 Xidr鲁山县 XweC郏县 ZFe9焦作 ZEeA中站区 ZGeJ马村区 Z5du沁阳市 Ysdl孟州市 ZEeQ修武县 ZAe4博爱县 Z6eN武陟县 Yue4温县 ZsfA鹤壁 ZjfH淇滨区 ZsfB山城区 ZwfA鹤山区 ZefW浚县 ZafB淇县 ZJeq新乡 ZOet凤泉区 ZPf4卫辉市 ZSem辉县市 ZGed获嘉县 Z3ev原阳县 Z8fB延津县 ZCff长垣县 Z2fP封丘县 a6fK安阳 a4en林州市 ZtfL汤阴县 Zvfs内黄县 ZYfU滑县 Zlg3濮阳 Zsg6清丰县 a4gC南乐县 ZsgT范县 Zxgp台前县 Zgg1濮阳县 Y1em许昌 Y1en魏都区 YAeS禹州市 YDek长葛市 Y1eo许昌县 Y6fB鄢陵县 XpeS襄城县 XYf2漯河 Xaey郾城区 XQeZ舞阳县 Xnev临颖县 YlcC三门峡 Yjcq义马市 YVbq灵宝市 Ygc5陕县 Ykcj渑池县 Y3c2卢氏县 WydW南阳 Wfd5邓州市 XTdP南召县 XFdy方城县 X2dE镇平县 X3du社旗县 Wfdo唐河县 WVdL新野县 X3cp内乡县 XIcS西峡县 X8cS淅川县 WMeO桐柏县 YQgc商丘 YQgd梁园区 YNgb睢阳区 XuhM永城市 Ycg8民权县 YPg3睢县 YQgJ宁陵县 Y4gH柘城县 YNgp虞城县 YEh8夏邑县 W8f4信阳 W6f7平桥区 WBfV罗山县 W1fs光山县 Vbfp新县 VmgO商城县 WAge固始县 W8g3潢川县 WQgO淮滨县 WLfh息县 Xbfc周口 Xcfc川汇区 XQfs项城市 Y4fO扶沟县 XlfW西华县 XXfa商水县 XNg4沈丘县 XcgB郸城县 Xifr淮阳县 Y4fq太康县 XpgS鹿邑县 Wxf1驻马店 XNf1西平县 XGfF上蔡县 Wvfb平舆县 WafN正阳县 Wmf1确山县 WheJ泌阳县 WyfL汝南县 X8ex遂平县 Wjfw新蔡县 Z5dZ济源市',
'湖北省 UYfH武汉 UZf2汉阳区 ULfJ武昌区 UqfL黄陂区 Upfl新洲区 UDg6黄石 U6fw大冶市 TogD阳新县 W5d6襄樊 W1d9襄阳区 W8dj枣阳市 WNcf老河口市 VgdF宜城县 WGcd谷城县 VrcG保康县 Vkco南漳县 Wdbl十堰 Wobn郧县 WybP郧西县 WEbE竹山县 WKah竹溪县 W4bi房县 UIdF沙市区 ThdO石首市 TneS洪湖市 UBck松滋市 U3dE公安县 Tnds监利县 ULdB江陵县 UgcH宜昌 UNcR宜都市 Uocl当阳市 UPcj枝江市 V4cc远安县 VEbj兴山县 V0bf秭归县 UScB长阳土家族自治县 UCbe五峰土家族自治县 Upc1三峡大坝 V2dC荆门 V1e6京山县 VAdZ钟祥县 UgdZ沙洋县 Uqdd旧口镇 V1e6新市镇 UOfr鄂州 Utes孝感 Udeo汉川市 VFef安陆市 UueY应城市 VXf7大悟县 VFex孝昌县 V1ei云梦县 VEew花园镇 VTfG新城镇 URfq黄州区 VBg2麻城市 TpgX武穴市 Ucfq团风县 VHfb红安县 UlgN罗田县 Ujge英山县 USgF浠水县 UEgP蕲春县 U5gu黄梅县 UlgN凤山镇 USgF清泉镇 TqfG咸宁 Theq赤壁市 Txes嘉鱼县 TGem通城县 TXf3崇阳县 TafU通山县 VheM随州 Vben广水市 UGaS恩施 UIZu利川市 Ubai建始县 V2bO巴东县 TxaT宣恩县 Tfa9咸丰县 TUaO来凤县 Tsb2鹤峰县 UMeR仙桃市 UPds潜江市 UdeA天门市 Vjbf神农架林区',
'湖南省 SCdw长沙 S9eb浏阳市 SCdx长沙县 SNdm望城县 SFdW宁乡县 Rqe7株洲 ReeT醴陵市 Rhe9株洲县 QyeK攸县 QleW茶陵县 QUek炎陵县 Rqds湘潭 RidV湘乡市 Rqdu湘潭县 Qsdb衡阳 REdh南岳区 QPdp耒阳市 QOdM常宁市 QxdK衡阳县 Qqda衡南县 REdp衡山县 R5dv衡东县 Qld7祁东县 RFcS邵阳 Qibb武冈市 RFci邵东县 RKcR新邵县 QycF邵阳县 R7c1隆回县 R4bY洞口县 QZb9绥宁县 QQbo新宁县 QLbI城步苗族自治县 QZb9长铺镇 TNe6岳阳 Sne5汨罗市 TSeS临湘县 T8e7岳阳县 TVdX华容县 Shdm湘阴县 SgeY平江县 TAdm洞庭湖 T2cf常德 Tccp津市市 TPd9安乡县 Stcw汉寿县 TQcc临澧县 Tccj澧县 SscS桃源县 TZcM石门县 T8bT张家界 TQc7慈利县 TObA桑植县 SZdK益阳 SpdM沅江市 TMdO南县 SVd7桃江县 SNcC安化县 Pne2郴州 PveD资兴市 Pidh桂阳县 POdv宜章县 Q8e7永兴县 PZdL嘉禾县 PHdW临武县 PXee汝城县 Q5eu桂东县 QgeF安仁县 QQcZ永州 QRcY冷水滩区 QDca零陵区 QZcp祁阳县 QOcH东安县 Pwcd双牌县 PWcY道县 PGcJ江永县 Pacv宁远县 PMdB蓝山县 PsdC新田县 PBcZ江华瑶族自治县 PBcY沱江镇 RXav怀化 R7ax洪江市 SRbO沅陵县 S0bA辰溪县 RsbZ溆浦县 RJb7中方县 Qrag会同县 Rram麻阳苗族自治县 RLaA新晃侗族自治县 RRae芷江侗族自治县 QYaf靖州苗族侗族自治县 QAak通道侗族自治县 RCam黔城镇 Rjcx娄底 RfcP冷水江市 Rgce涟源市 RRdB双峰县 RjcH新化县 SJai吉首市 SHb9泸溪县 RvaZ凤凰县 SaaS花垣县 Sgad保靖县 Sbau古丈县 T0ao永顺县 TRaQ龙山县 Saaw古阳镇',
'贵州省 QYXg贵阳 QXXS清镇市 R4Xw开阳县 QpXa修文县 R6Xi息烽县 QZVq六盘水 QZVq水城县 PmVd盘县 QCWT六枝特区 RgXu遵义 SZWg赤水市 RnXP仁怀市 RWXn遵义县 RwYB绥阳县 S8Xn桐梓县 SJXC习水县 RwYh凤冈县 SXYR正安县 RDYs余庆县 RkYT湄潭县 SrYa道真仡佬族苗族自治县 SWYr务川仡佬族苗族自治县 QFWu安顺 QJWj普定县 QPXG平坝县 Q3Wk镇宁布依族苗族自治县 PjX5紫云苗族布依族自治县 PvWb关岭布依族苗族自治县 RhaC铜仁 SGZ7德江县 RgZp江口县 RuZF思南县 RVZE石阡县 REZt玉屏侗族自治县 SAaC松桃苗族自治县 S0ZP印江土家族苗族自治县 SYZU沿河土家族自治县 RVaD万山特区 RIWH毕节 R2X2黔西县 R9Wa大方县 RIWH毕节县 QeWk织金县 RSXD金沙县 R8Vh赫章县 QlWN纳雍县 QqVH威宁彝族回族苗族自治县 P5Vs兴义市 PAX6望谟县 PQWB兴仁县 PlVv普安县 OyWn册亨县 PoWD晴隆县 PNWd贞丰县 P7WS安龙县 QZYx凯里市 R2Z7施秉县 PjZs从江县 QfaC锦屏县 R3ZP镇远县 QUYZ麻江县 QfZJ台江县 QtaC天柱县 QsYs黄平县 PuZV榕江县 QdZZ剑河县 QwZf三穗县 QNZ4雷山县 QEa8黎平县 RDZi岑巩县 QCYm丹寨县 QGYV都匀市 QgYV福泉市 QZYE贵定县 Q8Xd惠水县 PQXj罗甸县 R4YT瓮安县 PPYr荔波县 QSXx龙里县 PoYK平塘县 Q2XR长顺县 PoYX独山县 PyYq三都水族自治县',
'四川省 UeV4成都 UoV9新都区 UgUo温江区 V0Ub都江堰市 UxUu彭州市 UPUR邛崃市 UcUe崇州市 UpVQ金堂县 UmUr郫县 UPUm新津县 UYUt双流县 UCUU蒲江县 UZUV大邑县 TLVk自贡 TSVP荣县 TBVx富顺县 QXSi攀枝花 QrT7米易县 QtSX盐边县 SrWR泸州 SlWN纳溪区 SsWQ泸县 SnWo合江县 SBWR叙永县 S2Wn古蔺县 V9VN德阳 UxVH广汉市 V8VA什邡市 VLVC绵竹市 V3Vf中江县 VSVi绵阳 VlVi江油市 VEWN盐亭县 V6W5三台县 WPVW平武县 VdVQ安县 VcW9梓潼县 VoVR北川羌族自治县 WRWn广元 WZWE青川县 WDXH旺苍县 W2WS剑阁县 VjWu苍溪县 UVWZ遂宁 UrWN射洪县 UlWh蓬溪县 TZW4内江 TlVp资中县 TLWG隆昌县 TVVe威远县 TYUj乐山 TaUT峨眉山市 TiUY夹江县 TeV5井研县 TDUv犍为县 SwUs沐川县 SoUW马边彝族自治县 TEUG峨边彝族自治县 UmX5南充 VZWw阆中市 V5XY营山县 V2XP蓬安县 VWXO仪陇县 VMX4南部县 V1Wr西充县 U3Uo眉山 U0V9仁寿县 UCUq彭山县 TtUM洪雅县 U2UV丹棱县 ToUp青神县 SkVb宜宾 SgVV宜宾县 SKW5兴文县 SpVw南溪县 SNVm珙县 SZVs长宁县 SOVX高县 SiW3江安县 SAVV筠连县 SdVA屏山县 USXc广安区 UNXk华蓥市 UXXQ岳池县 UKXt邻水县 UMXH武胜县 W4Z3万源市 VEYU达县 UpXw渠县 VMYh宣汉县 V5Yq开江县 UiYC大竹县 TxTx雅安 UATu芦山县 TETM石棉县 U6U6名山县 U5Tj天全县 TmTo荥经县 UMTn宝兴县 TLTf汉源县 VpXk巴中 WMXo南江县 VYY7平昌县 VuYF通江县 U8Vd资阳 UNVX简阳市 U7WJ安岳县 UHW1乐至县 VtTE马尔康县 XGVE九寨沟县 WmTX红原县 VTUZ汶川县 WsSg阿坝县 VRUA理县 UyTL小金县 XZTw若尔盖县 W4Tx黑水县 VTT3金川县 WdUa松潘县 WGRw壤塘县 VfUp茂县 U3Sw康定县 UrSr丹巴县 VORf炉霍县 T0SV九龙县 VcQx甘孜县 U2S0雅江县 UvRI新龙县 UxS7道孚县 VDPo白玉县 TyRG理塘县 VmPZ德格县 SuQm乡城县 WxP6石渠县 T2RI稻城县 WGRK色达县 TtTE泸定县 U1Q7巴塘县 ShQH得荣县 RsTG西昌市 SKU8美姑县 S1To昭觉县 RgUF金阳县 SwTk甘洛县 RhTm布拖县 SGUY雷波县 RNTW普格县 R4Tj宁南县 SJTO喜德县 QdTY会东县 SdTU越西县 QeTE会理县 RQSU盐源县 ROTA德昌县 SXTA冕宁县 RuSH木里藏族自治县',
'西藏 TdI8拉萨 TsIG林周县 UTI6当雄县 TQHA尼木县 TLHi曲水县 TeHv堆龙德庆县 TeIL达孜县 ToIi墨竹工卡县 V9OA昌都 V8OA昌都县 VUPC江达县 UqPG贡觉县 VDNZ类乌齐县 VPMc丁青县 U3Nt八宿县 TfOp左贡县 TfPZ芒康县 UjMo洛隆县 UuLg边坝县 UeOY察雅县 TEIl山南地区 TEIl乃东县 TDII扎囊县 THHx贡嘎县 T2If琼结县 T3JC曲松县 SQIQ措美县 SNHq洛扎县 T8JZ加查县 SPJS隆子县 RyIv错那县 SwHO浪卡子县 TGFs日喀则 TfG6南木林县 StGa江孜县 SeE7定日县 SsF1萨迦县 T5Ec拉孜县 THEE昂仁县 TQFG谢通门县 T6GF白朗县 TEGo仁布县 SYGf康马县 SMEk定结县 TdBB仲巴县 RTFs亚东县 SpCJ吉隆县 S9Cw聂拉木县 TJCD萨嘎县 SGFW岗巴县 VTJ3那曲 VTJ3那曲县 UaKU嘉黎县 VTKf比如县 W7JH聂荣县 WGIe安多县 UuFg申扎县 VrKl索县 VMH1班戈县 VtL4巴青县 WU76阿里地区 WU75噶尔县 V1C9措勤县 UJ8B普兰县 VT6m札达县 XP6d日土县 WO87革吉县 WIB4改则县 WV76狮泉河 TeLL林芝地区 TeLL八一镇 TZLT林芝县 T3K6朗县 TDLC米林县 SeOT察隅县 TqMj波密县 TrKF工布江达县 TEIl泽当镇',
'云南省 P3Tg昆明 Q6UB东川区 OsTT安宁市 OsTm呈贡县 OeTa晋宁县 PETT富民县 OtU9宜良县 PKU2嵩明县 OkUG石林彝族自治县 PYTS禄劝彝族苗族自治县 PYUF寻甸回族彝族自治县 PaUn沾益县 PTUm曲靖 QDV6宣威市 PQUZ马龙县 P2Ue陆良县 OoUx师宗县 OrVI罗平县 PeVF富源县 QPUI会泽县 OLTW玉溪 OITj江川县 OeTt澄江县 O6Tj通海县 OCTu华宁县 OeT9易门县 OATO峨山彝族自治县 O5Sx新平彝族傣族自治县 NaT0元江哈尼族彝族傣族自治县 P7QA保山 P1PU腾冲县 OiQB施甸县 OZPf龙陵县 OoQa昌宁县 RLUh昭通 RCUX鲁甸县 QtTt巧家县 S5VF盐津县 RjUs大关县 SEUc永善县 SaUv绥江县 RQVq镇雄县 RcV3彝良县 RpW3威信县 ScVO水富县 QfRj永胜县 QcSG华坪县 QrRE玉龙纳西族自治县 RHRp宁蒗彝族自治县 MmRx思茅 N4S2普洱哈尼族彝族自治县 NQSg墨江哈尼族自治县 ORRo景东彝族自治县 NURg景谷傣族彝族自治县 NqRr镇沅彝族哈尼族拉祜族自治县 MaSq江城哈尼族彝族自治县 MKQa孟连傣族拉祜族佤族自治县 MYQu澜沧拉祜族自治县 MiQS西盟佤族自治县 NrR5临沧 OaQt凤庆县 OQR8云县 O2QF永德县 NrQ1镇康县 NSQo双江拉祜族佤族布朗族傣族自治县 NWQP耿马傣族佤族自治县 N9QF沧源佤族自治县 NMVE文山 NNVE文山县 NbVK砚山县 NRVe西畴县 N7Vf麻栗坡县 N1VN马关县 O3VC丘北县 O3W4广南县 NcWb富宁县 NMUO蒙自县 NLUA个旧市 NhUE开远市 N0TO绿春县 NbTn建水县 NhTT石屏县 OPUQ弥勒县 OWUk泸西县 NATj元阳县 NMTP红河县 MlUD金平苗族瑶族傣族自治县 MVUw河口瑶族自治县 MxUf屏边苗族自治县 M1Rm景洪市 LwRR勐海县 LTSY勐腊县 P2SX楚雄市 OgSc双柏县 PJSW牟定县 PCSH南华县 PVSF姚安县 PiSK大姚县 Q4Se永仁县 PgSr元谋县 PWTO武定县 P9T5禄丰县 PZRE大理 PTRY祥云县 PoRZ宾川县 PLRU弥渡县 PSQV永平县 PsQM云龙县 Q7Qv洱源县 QWQs剑川县 QYRB鹤庆县 PdQw漾濞彝族自治县 P3RW南涧彝族自治县 PERJ巍山彝族回族自治县 ORPZ潞西市 O1Oq瑞丽市 OmPI梁河县 OgOu盈江县 OMOw陇川县 QRQP兰坪县 PxPn泸水县 QsPr福贡县 RjPe贡山独龙族怒族自治县 STPs德钦县 RnQg香格里拉县 STPt德钦县 RBQH维西傈僳族自治县',
'重庆市 TXXV重庆 TWZl黔江区 ToXQ北碚区 ThXb江北区 UnZM万州区 TNXV巴南区 TTWk双桥区 ToY4长寿区 TyXG合川市 TMWs永川市 THXF江津市 TAY6南川市 T2Xc綦江县 UAWn潼南县 TpX3铜梁县 TgWg大足县 TOWZ荣昌县 TaXD璧山县 UJYL垫江县 TJYj武隆县 TrYh丰都县 VvZe城口县 UeYl梁平县 VCZP开县 VOab巫溪县 V5ar巫山县 V3aV奉节县 UwZr云阳县 UHZ1忠县 TyZ7石柱土家族自治县 SRZx秀山土家族苗族自治县 SoZk酉阳土家族苗族自治县 TIZ9彭水苗族土家族自治县',
'甘肃省 a4Uj兰州 aiUG永登县 ZoV6榆中县 aKUu皋兰县 cSTA金昌 cFSw永昌县 aXVC白银 aYVf靖远县 b9V5景泰县 ZgW3会宁县 YZWh天水 YhVs武山县 YiWJ甘谷县 YjX7清水县 YpWe秦安县 YxXC张家川回族自治县 dmPJ嘉峪关 btTc武威 cbU5民勤县 bSTr古浪县 awU8天祝藏族自治县 cuRR张掖 cQRn民乐县 clS5山丹县 d9RA临泽县 dMQn高台县 coQb肃南裕固族自治县 ZXXf平凉 Z4Ya灵台县 ZVWh静宁县 ZIY2崇信县 ZDXd华亭县 ZKYL泾川县 ZCX2庄浪县 djPV酒泉 dnOY玉门市 e8Le敦煌市 eWMl安西县 dxPs金塔县 dPLG阿克塞哈萨克族自治县 dVLr肃北蒙古族自治县 dmPJ嘉峪关 ZiYc庆阳市 ZiYc西峰区 a0Yr庆城县 ZfYB镇原县 ZnZ1合水县 aRYx华池县 aYYJ环县 ZUYt宁县 ZTZM正宁县 ZZVb定西 ZZVb安定区 ZCWE通渭县 ZNUp临洮县 YpVS漳县 YQV2岷县 Z8VC渭源县 Z0Vc陇西县 XOVu陇南市 XOVt武都区 XjWh成县 Y3VO宕昌县 XKWa康县 WvVf文县 Y1WH西和县 YCWA礼县 XtXI两当县 XkX5徽县 ZaUC临夏 ZUTy临夏县 ZMUg康乐县 ZuUK永靖县 ZTUY广河县 ZQUL和政县 ZeUN东乡族自治县 ZCTT甘南藏族自治州 ZCTV合作市 YfUM临潭县 YaUU卓尼县 XlVM舟曲县 Y4UD迭部县 XyT5玛曲县 YaTT碌曲县 ZJTH夏河县',
'宁夏回族 cSXG银川 c6XK灵武市 cHXF永宁县 cXXL贺兰县 d1XM石嘴山 d3XO大武口区 d7Xf惠农区 csXX平罗县 bxXC吴忠 brX0青铜峡市 axWt同心县 blYO盐池县 a1XG固原 ZwWh西吉县 ZpXc彭阳县 ZUXK泾源县 ZbX7隆德县 bVWA中卫 aXWc海原县 bTWe中宁县',
'青海省 abSl西宁 afSG湟源县 aUSY湟中县 auSf大通回族土族自治县 auSg桥头镇 aUT6平安县 aTTO乐都县 aKTm民和回族土族自治县 aoSv互助土族自治县 a6TG化隆回族自治县 ZpTT循化撒拉族自治县 aoSv威远镇 asRx海晏县 cARE祁连县 bKR8刚察县 bMSb门源回族自治县 bMSb浩门镇 bKR8沙柳河镇 cBRF八宝镇 ZVT1同仁县 ZuT2尖扎县 Z2SS泽库县 YiSb河南蒙古族自治县 ZVSy隆务镇 YiSa优干宁镇 aHRb共和县 ZFRZ同德县 a3SQ贵德县 ZZQx兴海县 ZZRj贵南县 aGRb恰卜恰镇 ZFRZ尕巴松多镇 a2SP河阴镇 ZZQx子科滩镇 ZYRk茫曲镇 YSRF玛沁县 WuRj班玛县 XvQt甘德县 XjQd达日县 XQST久治县 YtPD玛多县 WtRi赛来塘镇 YSRE大武镇 XwQr柯曲镇 X0O1玉树县 WyO0结古镇 WsMI杂多县 XMO6称多县 XpMb治多县 WCNT囊谦县 Y8Mk曲麻莱县 aPLr格尔木市 bMOM德令哈市 auPT乌兰县 aIP5都兰县 bIQ1天峻县 aIP5察汗乌苏镇 atPV希里沟镇 bIQ1新源镇',
'陕西省 YGZr西安 YMaC临潼区 YAZv长安区 YWa5高陵县 Y9aI蓝田县 Y7Za户县 YAZC周至县 Z4a4铜川 YtZw耀州区 ZOa7宜君县 YNY9宝鸡 YLYN陈仓区 YVYN凤翔县 YRYb岐山县 YMYq扶风县 YGYi眉县 YsXp陇县 YdY8千阳县 YfYm麟游县 XtXV凤县 Y4YI太白县 YKZZ咸阳 YIZT兴平市 YbZt三原县 YWZo泾阳县 YWZE乾县 YTZP礼泉县 YgZ8永寿县 Z2Z4彬县 ZDYl长武县 Z7ZJ旬邑县 YmZZ淳化县 YGZC武功县 YUaU渭南 YZb6华阴市 ZSbQ韩城市 YVak华县 YXbE潼关县 Ymau大荔县 YvaZ蒲城县 ZBat澄城县 ZBaZ白水县 ZEb8合阳县 YjaA富平县 aaaT延安 aZb1延长县 asbA延川县 b9af子长县 aqaJ安塞县 anZk志丹县 atZB吴起县 aHaK甘泉县 ZyaM富县 ZkaP洛川县 a3bA宜川县 ZZan黄龙县 ZZaG黄陵县 X4Y1汉中 X0Xu南郑县 X9YJ城固县 XDYW洋县 WxYj西乡县 X9Xe勉县 WoXF宁强县 XKX9略阳县 WWYs镇巴县 XbXu留坝县 XVYx佛坪县 cHaj榆林 cnbT神木县 d2c4府谷县 bwaH横山县 bZZm靖边县 bZYZ定边县 bUbF绥德县 bjbA米脂县 c1bT佳县 bRbi吴堡县 b5b7清涧县 bbb2子洲县 Wfa1安康 WsZV汉阴县 X2ZF石泉县 XJZI宁陕县 WVZV紫阳县 WJZs岚皋县 WOaL平利县 VraV镇坪县 WoaM旬阳县 Wmb6白河县 Xqau商洛市 Xqau商州区 Y5b8洛南县 XfbJ丹凤县 XWbq商南县 XVaq山阳县 XQaA镇安县 Xfa6柞水县',
'新疆维吾尔 hlEZ乌鲁木齐 iJBp独山子区 jaBq克拉玛依 huET五家渠市 iID2石河子市 eX8G阿拉尔市 dw6D图木舒克市 gwGB吐鲁番市 gqHD鄯善县 glFd托克逊县 gnKV哈密市 hFLf伊吾县 haK1巴里坤哈萨克自治县 fA7F阿克苏市 fG7E温宿县 fD9k沙雅县 fm8q拜城县 ec7N阿瓦提县 fh9w库车县 eU63柯坪县 fX9a新和县 fD6E乌什县 b76t和田市 b66u和田县 bG6i墨玉县 bb5H皮山县 b47B洛浦县 b07m策勒县 ap8e于田县 b49f民丰县 dS2x喀什市 dl5X巴楚县 cB4G泽普县 dU3i伽师县 br4P叶城县 dE3k岳普湖县 dP33疏勒县 cs4d麦盖提县 cu3A英吉沙县 cP4F莎车县 dN2p疏附县 bl2E塔什库尔干塔吉克自治县 dh3A阿图什市 d92u阿克陶县 eu5R阿合奇县 dg2B乌恰县 fkBF轮台县 fKDG尉犁县 d1FA若羌县 c8CW且末县 g4DY焉耆回族自治县 gJDN和静县 gFDq和硕县 fwDc博湖县 i1EI昌吉市 iAEw阜康市 hwEd米泉市 iBDs呼图壁县 iIDD玛纳斯县 i1GZ奇台县 hyGB吉木萨尔县 hnHH木垒哈萨克自治县 is94博乐市 ib9r精河县 iw82温泉县 ht8I伊宁市 iQBs奎屯市 hx8V伊宁县 i37q霍城县 hT9E巩留县 hQAF新源县 h988昭苏县 hD8o特克斯县 hl9U尼勒克县 ho89察布查尔锡伯自治县 kj9x塔城市 iQBf乌苏市 kVAb额敏县 iJCb沙湾县 juAa托里县 kD9w裕民县 kmCi和布克赛尔蒙古自治县 lgDq布尔津县 kyGV富蕴县 l7EU福海县 m4DP哈巴河县 keHN青河县 lQCr吉木乃县',
'港澳台 MCf5香港 M8eK澳门 P2mU台北市 MblH高雄市 P8mi基隆市 O9le台中市 N0lC台南市 Onlv新竹市 NTlQ嘉义市 P1mS台北县 Okmj宜兰县 OwmI桃园县 OWlm苗栗县 OFlh台中县 O5lW彰化县 Ntle南投县 NhlW云林县 NJlJ台南县 MclM高雄县 MelT屏东县 Mjm9台东县 Nxma花莲县 NZkZ澎湖县'
);
    
    private static maps: Array<Object>;
    
    private static initMaps(){
        if (LandMaps.maps) return;
        LandMaps.maps = new Array<Object>();

        LandMaps.maps.push({Name: '未知', Cities: [{Name: '未知', Code: null}]});
        
        try{
            for (let id = 0; id < LandMaps.JWv.length; id++) {
                var item = LandMaps.JWv[id].split(" ");
                var land = {
                    Name: item[0],
                    Cities: []
                };
                
                LandMaps.maps.push(land);
        
                for (var idx = 1; idx < item.length; idx++) {
                    let ty = {
                        Name: item[idx].substring(4),
                        Code: item[idx].substring(0, 4)
                    }
        
                    land.Cities.push(ty);
                }
            };
            
            
        }catch(err){
            Log(err)
        }
    }
    
    static FindCity(landName: string, cityName: string){
        LandMaps.initMaps();
        var land = LandMaps.maps.filter(l => { return l['Name'].indexOf(landName) == 0; });
        if (land.length === 1) {
            var city = land[0]['Cities'].filter(c => { return c['Name'].indexOf(cityName) == 0; });
            return city.length == 1 ? city[0] : null;
        };

        return null;
    }
    
    static CalcTimeOff(code){
        if (code == undefined || code == null || code == '') return 0;

        var v = code.split('');
        for (let i = 0; i < 4; i++) { //对经纬度解压缩   
            v[i] = v[i].charCodeAt(0);
            if (v[i] > 96) v[i] -= 97 - 36;
            else if (v[i] > 64) v[i] -= 65 - 10;
            else v[i] -= 48;
        }

        var jd = (v[2] + v[3] / 60 + 73);
        var lngDiff = parseFloat(jd) - 120;
        var timediff = Math.ceil(lngDiff * 4);
        return timediff;
    }
    
    static get Maps(){
        LandMaps.initMaps();
        return LandMaps.maps;
    }
}