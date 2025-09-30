// Array untuk menyimpan data buku
let booksData = [];
let currentEditId = null;

// Fungsi untuk generate ID unik
function generateId() {
    return new Date().getTime();
}

// Simpan buku ke localStorage
function saveBooks() {
    localStorage.setItem('books', JSON.stringify(booksData));
    console.log('Books saved:', booksData);
}

// Load data awal dari localStorage
function loadBooks() {
    const saved = localStorage.getItem('books');
    booksData = saved ? JSON.parse(saved) : [];

    // Kalau kosong, kasih contoh buku
    if (booksData.length === 0) {
        booksData = [
            { id: 1, title: "Harry Potter", author: "J.K. Rowling", year: 1997, isComplete: false },
            { id: 2, title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, isComplete: true }
        ];
        saveBooks();
    }
}

// Tambah buku baru
function addBook(title, author, year, isComplete) {
    const newBook = { id: generateId(), title, author, year: parseInt(year), isComplete };
    booksData.push(newBook);
    saveBooks();
    renderBooks();
    showNotification("Buku berhasil ditambahkan!", "success");
}

// Hapus buku
function deleteBook(id) {
    if (confirm("Yakin ingin menghapus buku ini?")) {
        booksData = booksData.filter(book => book.id !== id);
        saveBooks();
        renderBooks();
        showNotification("Buku berhasil dihapus!", "success");
    }
}

// Toggle status selesai/belum
function toggleBookStatus(id) {
    const book = booksData.find(b => b.id === id);
    if (book) {
        book.isComplete = !book.isComplete;
        saveBooks();
        renderBooks();
        showNotification(`Buku dipindahkan ke rak ${book.isComplete ? "selesai" : "belum selesai"}!`, "success");
    }
}

// Edit buku
function editBook(id) {
    const book = booksData.find(b => b.id === id);
    if (book) {
        currentEditId = id;
        document.getElementById('editTitle').value = book.title;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editYear').value = book.year;
        document.getElementById('editCompleted').checked = book.isComplete;
        document.getElementById('editModal').style.display = 'block';
    }
}

// Update buku
function updateBook(title, author, year, isComplete) {
    const book = booksData.find(b => b.id === currentEditId);
    if (book) {
        book.title = title;
        book.author = author;
        book.year = parseInt(year);
        book.isComplete = isComplete;
        saveBooks();
        renderBooks();
        closeModal();
        showNotification("Buku berhasil diperbarui!", "success");
    }
}

// Render semua buku
function renderBooks() {
    const incompleteList = document.getElementById('incompleteBookList');
    const completeList = document.getElementById('completeBookList');
    incompleteList.innerHTML = '';
    completeList.innerHTML = '';

    const incompleteBooks = booksData.filter(book => !book.isComplete);
    const completeBooks = booksData.filter(book => book.isComplete);

    if (incompleteBooks.length === 0) {
        incompleteList.innerHTML = `<p class="empty-shelf">📖 Belum ada buku yang sedang dibaca</p>`;
    }
    if (completeBooks.length === 0) {
        completeList.innerHTML = `<p class="empty-shelf">✅ Belum ada buku yang selesai dibaca</p>`;
    }

    booksData.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-item');
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <div class="book-actions">
                <button class="btn" onclick="toggleBookStatus(${book.id})">${book.isComplete ? '↩️ Belum' : '✅ Selesai'}</button>
                <button class="btn" onclick="editBook(${book.id})">✏️ Edit</button>
                <button class="btn" onclick="deleteBook(${book.id})">🗑️ Hapus</button>
            </div>
        `;
        if (book.isComplete) {
            completeList.appendChild(bookElement);
        } else {
            incompleteList.appendChild(bookElement);
        }
    });
}

// Cari buku
function searchBooks(keyword) {
    if (!keyword.trim()) {
        renderBooks();
        return;
    }
    const lowerKeyword = keyword.toLowerCase();
    const filtered = booksData.filter(book => book.title.toLowerCase().includes(lowerKeyword));
    renderFilteredBooks(filtered);
    if (filtered.length === 0) {
        showNotification("Tidak ada buku yang ditemukan", "info");
    }
}

function renderFilteredBooks(filteredBooks) {
    const incompleteList = document.getElementById('incompleteBookList');
    const completeList = document.getElementById('completeBookList');
    incompleteList.innerHTML = '';
    completeList.innerHTML = '';

    filteredBooks.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-item');
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
            <div class="book-actions">
                <button class="btn" onclick="toggleBookStatus(${book.id})">${book.isComplete ? '↩️ Belum' : '✅ Selesai'}</button>
                <button class="btn" onclick="editBook(${book.id})">✏️ Edit</button>
                <button class="btn" onclick="deleteBook(${book.id})">🗑️ Hapus</button>
            </div>
        `;
        if (book.isComplete) {
            completeList.appendChild(bookElement);
        } else {
            incompleteList.appendChild(bookElement);
        }
    });
}

// Tutup modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
}

// Notifikasi
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 18px;
        background: ${type === 'success' ? '#28a745' : (type === 'info' ? '#007bff' : '#dc3545')};
        color: white;
        border-radius: 6px;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = "fadeOut 0.3s ease forwards";
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Animasi notifikasi
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    renderBooks();

    document.getElementById('bookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('bookTitle').value.trim();
        const author = document.getElementById('bookAuthor').value.trim();
        const year = document.getElementById('bookYear').value;
        const isComplete = document.getElementById('bookCompleted').checked;
        if (title && author && year) {
            addBook(title, author, year, isComplete);
            this.reset();
        }
    });

    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('editTitle').value.trim();
        const author = document.getElementById('editAuthor').value.trim();
        const year = document.getElementById('editYear').value;
        const isComplete = document.getElementById('editCompleted').checked;
        if (title && author && year) {
            updateBook(title, author, year, isComplete);
        }
    });

    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchBooks(e.target.value);
    });

    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('editModal');
        if (e.target === modal) {
            closeModal();
        }
    });
});
