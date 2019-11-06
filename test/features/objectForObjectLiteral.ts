interface Foo {
    name: string
    getName: () => string
}

class Bar {
    static bar: string = 's'
    static getBar() {
        return 'name'
    }
    name: 'name'
    method() {
        this.name
    }
}

// 接口对象
const foo: Foo = { name: 'name', getName: () => 'name' }
console.log("object literal as interface")
console.log(foo.name)
console.log(foo.getName())

// 普通对象
const bar = { name: 'name', getName: () => 'name' }
console.log("object literal")
console.log(bar.name)
console.log(bar.getName())

// 数组对象
const arr1 = [1, 2, 3]
console.log('read array element')
console.log(arr1[2])

// 类型缺失：猜类型
const arr2: any = [1, 2, 3]
const i = 2
console.log(arr2[i])
console.log(arr2[2])

// 静态属性
console.log('static property/method')
console.log(Bar.bar)
console.log(Bar.getBar())

// 元素访问语法
console.log('nested property access')
console.log(bar['name'])
console.log((bar['getName'] as () => string)())
console.log(bar[bar['name'] as 'name'])
