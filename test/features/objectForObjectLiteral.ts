interface Foo {
    name: string
    getName: () => string
}

class Bar {
    static bar: string = 's'
    static getBar() {
        return 's'
    }
    name: 'name'
    method() {
        this.name
    }
}

// 接口对象
const foo: Foo = { name: 's', getName: () => 's' }
foo.name
foo.getName()

// 普通对象
const bar = { name: 's', getName: () => 's' }
bar.name
bar.getName()

// 数组对象
const arr1 = [1, 2, 3]
arr1[2]

// 类型缺失：猜类型
const arr2: any = [1, 2, 3]
const i = 2
arr2[i]
arr2[2]

// 静态属性
Bar.bar
Bar.getBar()

// 包装
bar['name']
bar[bar['name'] as 'name']
