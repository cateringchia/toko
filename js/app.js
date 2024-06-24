document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({

        items: [{
            Id: 1,
            Menu: "Nasi",
            Gambar: "Bento-Set.jpg",
            Harga: 30000



        }]
    }));

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        add(newItem) {

            const cartItem = this.items.find((item) => item.Id === newItem.Id);

            if (!cartItem) {
                this.items.push({...newItem,
                    quantity: 1,
                    total: newItem.Harga
                });
                this.quantity++;
                this.total += newItem.Harga;
            } else {
                this.items = this.items.map((item) => {
                    if (item.Id !== newItem.Id) {
                        return item;
                    } else {
                        item.quantity++;
                        item.total = item.Harga * item.quantity;
                        this.quantity++;
                        this.total += item.Harga;
                        return item;
                    }
                });
            }
        },
        remove(Id) {
            const cartItem = this.items.find((item) => item.Id === Id);
            if (cartItem.quantity > 1) {
                this.items = this.items.map((item) => {
                    if (item.Id !== Id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.Harga * item.quantity;
                        this.quantity--;
                        this.total -= item.Harga;
                        return item;
                    }
                })
            } else if (cartItem.quantity === 1) {
                this.items = this.items.filter((item) => item.Id !== Id);
                this.quantity--;
                this.total -= cartItem.Harga;
            }
        },
        trash(Id) {
            // Menghapus item dari keranjang berdasarkan Id
            const index = this.items.findIndex((item) => item.Id === Id);
            if (index !== -1) {
                this.quantity -= this.items[index].quantity; // Mengurangi jumlah total item
                this.total -= this.items[index].total; // Mengurangi total harga
                this.items.splice(index, 1); // Menghapus item dari array
            }
        },
        getTotal() {
            // Menghitung total harga dari semua item dalam keranjang
            return this.items.reduce((total, item) => total + item.total, 0);
        }
    });
});
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;
const form = document.querySelector('#checkoutForm');
form.addEventListener('keyup', function() {
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');


});

checkoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const message = formatMessage(objData);
    window.open(`https://wa.me/62895621762008?text=` + encodeURIComponent(message));
});
const formatMessage = (obj) => {
        return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.telepon}
Data Pesanan
    ${JSON.parse(obj.items).map((item) => `${item.Menu} (${item.quantity} x ${rupiah(item.total)}) \n`)}
TOTAL : ${rupiah(obj.total)}`

};
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};