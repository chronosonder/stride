class User {
    constructor(id, username, email, passwordHash, createdAt, updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Safe object for API responses (excluded passwordHash)
    toPublic() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Compare User object hashed password with provided password using
    async verifyPassword(password, bcrypt) {
        return await bcrypt.compare(password, this.passwordHash);
    }
}

module.exports = User;