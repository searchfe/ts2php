import Vue, {PropType} from 'vue';

interface User {
    names: string[];
}

export default Vue.extend({
    props: {
        b: String,
        c: Object as PropType<User>
    },
    data() {
        return {
            a: this.b + 1,
            d: this.c.names.join(',')
        };
    }
});
