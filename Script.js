if (window.localStorage.getItem("user_key") != null) {
    document.getElementById('nameregister').innerHTML = " ";
    document.getElementById('nameregister').innerHTML = window.localStorage.getItem('user_key')
}
let coloring = document.getElementById('happy');
coloring.innerHTML = `<h2> Chúc C2022I1 Luôn Vui Vẻ, Thành Công Và Hạnh Phúc Trên Con Đường Mình Chọn!!! </br>
                        Chúng Mình Cùng Nghe Nhạc Thư Giãn Nào Hehe</h2>`
coloring.style.color = 'violet'
if (window.localStorage.getItem('user_key') == null) {
    document.getElementById('happy').innerHTML = "<h2>Pleas login</h2>"
    document.getElementById('data_list').innerHTML = " ";
}
let dream = document.getElementById('sleepy');
dream.innerHTML = "<h2>Đi Ngủ Đã</h2>"
dream.style.color = "gray"

