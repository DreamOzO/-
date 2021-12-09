function cover(coverTitle, coverTitle1, coverTitle2, coverTitle3, coverDesc, coverPic, coverUrl, hasLine) {
    try {
        d.push({
            title: '‘‘’’<><font color="#fdc830">' + pdfh(html, coverTitle) + '\n' + '‘‘’’<><font color="#fdc830">' +  pdfh(html, coverTitle1)+ '\n',
            desc: '‘‘’’<><font color="#f7b733">' + pdfh(html, coverTitle2) + '\n' + '‘‘’’<><font color="#f7b733">' + pdfh(html, coverTitle3),
            pic_url: pdfh(html, coverPic),
            url: pdfh(html, coverUrl),
            col_type: 'movie_1_vertical_pic_blur'
        });
        d.push({     
    col_type: 'line'
    });
        let item = {
        	title: '‘‘’’<font color="#098AC1">' + '剧情简介',
            desc: '‘‘’’<small><font color="#9E7A7A">' + pdfh(html, coverDesc).substr(0, 38) + '...</font><small><font color="#9E7A7A">详情</font></small></small>',
            url: 'hiker://empty#' + '\n' + pdfh(html, coverDesc) + `@rule=js:var res = {}; var d = [];d.push({title:'简介：'+ MY_URL.split('hiker://empty#')[1],col_type: 'long_text'});res.data = d; setHomeResult(res);`,
            col_type: 'text_1'
        }
        if (hasLine) {
            item.extra = {
                lineVisible: false
            }
        }
        d.push(item);
        d.push({     
    col_type: 'line'
    })
        d.push({     
    col_type: 'line'
    })
    } catch (e) {}
}
function chapter(chapterList, chapterTitle, chapterUrl, defaultOrder, hasLine) {
    var list = chapterList;
    var original = [{
        url: MY_URL,
        order: defaultOrder
    }];
    !fileExist('hiker://files/rules/comic/comicLogFile.js') ? (writeFile('hiker://files/rules/comic/comicLogFile.js', JSON.stringify(original))) : 0;
    var log = JSON.parse(fetch('hiker://files/rules/comic/comicLogFile.js'));
    for (var i in log) {
        if (log[i].url == MY_URL) {
            var now = i;
            var order = log[i].order;
            break;
        } else {
            var now = '';
            var order = defaultOrder;
        }
    }
    let orderItem = {
        title: "““””" + '<font color="#f37335">' + '章节排序⇅' + '</font>',
        url: MY_URL + `@lazyRule=.js:var log = JSON.parse(fetch('hiker://files/rules/comic/comicLogFile.js'));var now='` + now + `';if(now!=''){var now=parseInt(now);var order=log[now].order}else{var now=parseInt(log.length);var order=` + defaultOrder + `;log.push({url:input,order:order});}if(log[now].order){log[now].order=0;}else{log[now].order=1;};writeFile('hiker://files/rules/comic/comicLogFile.js', JSON.stringify(log));refreshPage();'hiker://empty'`,
        col_type: 'text_center_1'
    }
    if (hasLine) {
          orderItem.title = "““””" + '<font color="#f37335">' + '集数排序⇅' + '</font>';
        orderItem.col_type = "scroll_button"
    }   
    d.push(orderItem);
    d.push({     
    col_type: 'line'
    });
    
    var list = order ? list : list.reverse();
    for (var i in list) {
        try {
            d.push({
                title: pdfh(list[i], chapterTitle),
                url: pd(list[i], chapterUrl) + lazy,
                col_type: pdfh(list[0], chapterTitle).length > 6? 'text_2' : 'text_3',
            });
        }catch (e) {}
    }
}

function line(lineList, lineTitleRule, varKey) {
    let list = lineList
    varKey = varKey == null ? (MY_RULE.url + '#line-index'):  varKey;
    addListener('onClose', $.toString((keyList) => {
        for (let i in keyList) {
            clearVar(keyList[i])
        }

    }, [varKey, MY_RULE.title + '#line-title']))
    let line0Title = ''
    try {
        line0Title = pdfh(list[0], lineTitleRule);
    } catch (e) {}
    log(MY_RULE.title + getVar((MY_RULE.title + '#line-title')))
    for (let i in list) {
        try {
            let lineTitle = pdfh(list[i], lineTitleRule);
            d.push({
                title: getVar((MY_RULE.title + '#line-title'), line0Title) === lineTitle ? "切换:‘‘" + lineTitle+"":lineTitle+"‘‘:切换",
                url: $().lazyRule((varKey, lineIndex, lineTitle) => {
                    putVar(varKey, lineIndex.toString())
                    // log(MY_RULE.url)
                    putVar((MY_RULE.title + '#line-title'), lineTitle)
                    log(MY_RULE.title + getVar((MY_RULE.title + '#line-title')))
                    refreshPage()
                    return "toast://已切换至" + lineTitle
                }, varKey, i, lineTitle),
                col_type: 'scroll_button'
            });
        } catch (e) {}
    }
}

                