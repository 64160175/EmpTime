document.addEventListener('DOMContentLoaded', function() {
    var deleteButton = document.querySelector('.delete-button');
    var deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));

    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            deleteModal.show();
        });
    }
});
