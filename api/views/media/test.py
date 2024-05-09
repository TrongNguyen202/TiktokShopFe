import uuid


def get_machine_uuid():
    # Lấy UUID của máy tính
    return str(uuid.getnode())


# In ra UUID của máy tính
print("UUID của máy tính:", get_machine_uuid())
