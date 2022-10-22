let createSvg = function (name) {
    return `<svg class="icon" aria-hidden="true" type="${name}">
                <use xlink:href="#icon-${name}"></use>
            </svg>
            `
}
svgList = [createSvg("binggao"), createSvg("baomihua"), createSvg("niujiaobao"), createSvg("shousi"), createSvg("pijiu"), createSvg("jitui"), createSvg("xuegao"), createSvg("xia"), createSvg("hanbao"), createSvg("shutiao")]
console.log(svgList.length)
function shuffle(array) {//数组随机排序方法
    let res = [], random;
    while (array.length > 0) {
        random = Math.floor(Math.random() * array.length);
        res.push(array[random]);
        array.splice(random, 1);
    }
    return res;
}
class Box {
    row = 7 //行数
    column = 7 //列数
    numberOfLayer = 5 //层数
    basicSize = 40 //卡片大小
    density = 0.3//密度
    overMap = [] //遮挡数组
    cardArray = [] //卡片三维数组
    toDoCard = [] //下面装卡片的区域
    maxCardNum = 9
    that //this指针
    box
    createdCard = 0
    constructor(container) {
        this.init()
        container.appendChild(this.box)
    }
    init() {
        this.initoverMap()
        this.createBox("box")
        this.drawAllCard()
        this.renderCard()
        this.ensureNum()
        this.fillSvgPic()
        this.bindDomEvent(this.box)
    }
    createBox(className) {
        let box = document.createElement('div')
        box.classList.add(className)
        box.style.position = 'relative'
        box.style.width = box.style.height = (this.row + 1) * this.basicSize + 'px' //防止溢出
        this.box = box
    }
    initoverMap() {//初始化遮挡数组
        let temp = []
        for (let i = 0; i < (this.column + 1) * 2; i++) {
            let rowArr = new Array((this.row + 1) * 2).fill(0)
            temp.push(rowArr)
        }
        this.overMap = temp
    }
    drawCard() {//绘制二维层
        this.initoverMap()
        let layer = JSON.parse(JSON.stringify(this.overMap))
        //random
        for (let i = 1; i <= this.row * 2; i++) {
            for (let j = 1; j <= this.column * 2; j++) {
                if (Math.random() < this.density) {//随机密度
                    if ((this.overMap[i][j] || this.overMap[i][j + 1] || this.overMap[i + 1][j] || this.overMap[i + 1][j + 1]) === 0) {
                        layer[i][j] = 1
                        this.overMap[i][j] = this.overMap[i][j + 1] = this.overMap[i + 1][j] = this.overMap[i + 1][j + 1] = 1
                        console.log(1)
                    }
                }
            }
        }
        this.cardArray.push(layer)
    }
    drawAllCard() {
        for (let i = 0; i < this.numberOfLayer; i++) {
            this.drawCard()
        }
    }
    renderCard() {
        this.cardArray.forEach(item => {
            for (let i = 1; i <= this.row * 2; i++) {
                for (let j = 1; j <= this.column * 2; j++) {
                    if (item[i][j] === 1) {
                        this.createdCard++
                        let div = document.createElement('div')
                        div.classList.add('card')
                        div.style.width = div.style.height = this.basicSize + 'px'
                        div.style.position = 'absolute'
                        let x = i * this.basicSize / 2 + 'px'
                        let y = j * this.basicSize / 2 + 'px'
                        div.style.left = x
                        div.style.top = y
                        this.box.appendChild(div)
                    }
                }
            }
        })
    }
    ensureNum() {//确保已经创建的card是三的倍数
        let out = this.createdCard % 3
        if (out !== 0) {
            //Math.floor(Math.random() * (m - n)) + n  生成n到m之间的整数，包括n与m
            console.log(this.box.childNodes.length, out)
            for (let i = 0; i < out; i++) {
                let temp = Math.floor(Math.random() * this.box.childNodes.length - 1)
                this.box.removeChild(this.box.childNodes[temp])
                this.createdCard--
            }
            console.log(this.box.childNodes.length, out)
        }
    }
    fillSvgPic() {//填充svg图片
        let tempArr = []
        for (let i = this.box.childNodes.length / 3; i >= 1; i--) {
            tempArr.push(svgList[i % 10], svgList[i % 10], svgList[i % 10])
        }
        tempArr = shuffle(tempArr)
        for (let i = 0, len = this.box.childNodes.length; i < len; i++) {
            this.box.childNodes[i].innerHTML = tempArr[i]
        }

    }
    bindDomEvent(dom) {
        let that = this
        dom.addEventListener('click', function (e) {
            let target = e.target
            if (target.className === 'card') {
                that.clickCard(target)
            }
        }, false)
    }
    clickCard(card) {
        let that = this
        let numOfCard = 0//卡片应该在第几个
        //先从todocard从后向前找，如果找不到就放到最后，如果找到了，就放到同类型的后面
        numOfCard = this.toDoCard.length
        let nowType = card.firstElementChild.getAttribute('type')
        console.log(card.firstElementChild.getAttribute('type'))
        for (let i = this.toDoCard.length - 1; i >= 0; i--) {
            if (this.toDoCard[i].firstElementChild.getAttribute('type') === nowType) {
                numOfCard = i + 1
                console.log("找到重复的了")
            }
        }
        this.toDoCard.splice(numOfCard, 0, card)
        this.moveCard(this.toDoCard)
        setTimeout(function () {
            that.checkUpCard(card)
        }, 500)
    }
    moveCard(arr) {
        let y = (this.column + 2) * this.basicSize
        for (let i = 0; i < arr.length; i++) {
            arr[i].style.left = this.basicSize / 2 + i * this.basicSize + 'px'
            arr[i].style.top = y + 'px'
        }
    }
    checkUpCard(card) {
        if (this.toDoCard.length >= this.maxCardNum) {
            alert("game over")
            return
        }
        let sameNum = 0
        let nowType = card.firstElementChild.getAttribute('type')
        let tempArr = []
        this.toDoCard.forEach(item => {
            if (item.firstElementChild.getAttribute('type') === nowType) {
                sameNum++
                tempArr.push(item)
            }
        })
        console.log('samenum----->', sameNum)
        if (sameNum >= 3) {
            this.toDoCard = this.toDoCard.filter((type) => {
                console.log(type.firstElementChild.getAttribute('type'))
                return type.firstElementChild.getAttribute('type') !== nowType
            })
            tempArr.forEach(item => {
                this.box.removeChild(item)
            })
            console.log(" 剩余的-----》", this.toDoCard)
            this.moveCard(this.toDoCard)
        }
    }
}
window.onload = function () {
    let box = new Box(document.querySelector('.container'))
}