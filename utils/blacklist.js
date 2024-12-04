const blacklist = new Set(); // 메모리에 블랙리스트 저장

// 블랙리스트에 토큰 추가
function addToBlacklist(token) {
    console.log("Adding token to blacklist:", token);
    blacklist.add(token);
    console.log("Current blacklist:", Array.from(blacklist));
}

// 블랙리스트에서 토큰 확인
function isBlacklisted(token) {
    return blacklist.has(token);
}

module.exports = {
    addToBlacklist,
    isBlacklisted,
};
