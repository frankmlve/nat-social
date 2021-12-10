// SPDX-License-Identifier: UNLISCENSED
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.10;

contract SocialNetwork {
    
    string public name;
    uint256 private postCount = 0;
    uint256 private likesCount = 0;
    uint256 private commentCount = 0;
    uint256 private filesCount = 0;
    uint256 private userCount = 0;
    uint256 private followedCount = 0;
    address[]  usersAddress;

    mapping(uint256 => Post) private posts;
    mapping(address => User) private users;
    mapping(uint256 => Like) private likes;
    mapping(uint256 => Comment) private comments;
    mapping(uint256 => File[]) private files;
    mapping(uint256 => Followed) private followed;


    struct User {
        uint256 id;
        string image;
        string username;
        string description;
        address payable account;
        uint256 createDate;
    }
    struct Followed {
        uint256 followerId;
        User _followed;
    }
    struct FollowedUserPosts {
        AllPostInfo[] _followedUsersPosts;
    }
    struct Comment {
        User user;
        string comment;
        uint256 postId;
        uint256 id;
        uint256 commentDate;
    }
    struct AllPostInfo {
        Post post;
        Comment[] comments;
        Like[] likes;
        File[] files;
    }
    struct File {
        uint256 postId;
        string hash;
        string fileType;
    }
    struct Post {
        uint256 id;
        string description;
        User author;
        uint256 postDate;
    }
    struct Like {
        uint256 postId;
        User user;
    }

    event UserCreated(
        uint256 _userId,
        string hash,
        string username,
        string description,
        address payable author,
        uint256 createDate
    );
    event UserUpdate(
        uint256 _userId,
        string hash,
        string username,
        string description,
        address payable author
    );

    event PostCreated(
        uint256 id,
        string description,
        User author,
        uint256 postDate
    );

    event PostCommented(
        uint256 id,
        uint256 postId,
        string comment,
        User user,
        uint256 commentDate
    );
    event PostLiked(
        uint256 imageId,
        User user
    );
    event PostUnLiked(
        uint256 imageId,
        User user
    );
    event NewFollowed(
        uint256 _userId,
        User _user
    );
    constructor() {
        name = "SocialNetwork";
    }
    //Handling users
    function createUser(
        string memory _username,
        string memory _profileImg,
        string memory _description,
        address _account
    ) public {
        for (uint i = 0; i < usersAddress.length; i++) {
             require(keccak256(abi.encodePacked(_username)) != keccak256(abi.encodePacked(users[usersAddress[i]].username)), "Username already exist, try another one");
             require(_account != users[usersAddress[i]].account, "You already have an account");
        }
        userCount++;
        users[_account] = User(userCount, _profileImg, _username, _description, payable(_account), block.timestamp);
        usersAddress.push(_account);
        emit UserCreated(userCount, _profileImg, _username, _description, payable(_account), block.timestamp);
    }
    function userUpdate(
        string memory _profileImgHash,
        string memory _username,
        string memory _description,
        User memory author
    ) public {
        for (uint i = 0; i < usersAddress.length; i++) {
            if (keccak256(abi.encodePacked(_username)) != keccak256(abi.encodePacked(author.username)) ){
                require(keccak256(abi.encodePacked(_username)) != keccak256(abi.encodePacked(users[usersAddress[i]].username)), "Username already exist, try another one");
            }
        }
        users[author.account] = User(author.id, _profileImgHash, _username, _description, author.account, block.timestamp);
        emit UserUpdate(author.id, _profileImgHash, _username, _description, author.account);
    }
    function deleteUser(address _account) public {
        require(msg.sender != address(0));
        require(_account != address(0));
        delete users[_account];
        for (uint i = 0; i < usersAddress.length; i++){
            if (usersAddress[i] == _account){
                delete usersAddress[i];
                break;
            }
        }
    }
    function getUsers() public view returns (User[] memory) {
        User[] memory userList = new User[](usersAddress.length);
        for (uint i = 0; i < usersAddress.length; i++) {
            userList[i] = users[usersAddress[i]];
        }
        return userList;
    }
    function getUser(address userAccount) public view returns (User memory) {
        return users[userAccount];
    }
    function getUserByUserName(string memory _username) public view returns (User memory) {
        for (uint i = 0; i < usersAddress.length; i++){
            if (keccak256(abi.encodePacked(_username)) == keccak256(abi.encodePacked(users[usersAddress[i]].username))) {
                return users[usersAddress[i]];
            }
        }
        return User(0,'','','', payable(address(0)),0);
    }

    //Handling posts
    function createPost(
        File[] memory _files,
        string memory _description,
        User memory _user
    ) public payable{
        // Make sure image description exists
        require(bytes(_description).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));
        require(payable(msg.sender) == _user.account, "only current owner can update owner");
        // Increment image id
        postCount++;
        // Add Image to the contract
        for (uint i = 0; i < _files.length; i ++){
            addFileToPost(_files[i], postCount);
        }
        posts[postCount] = Post(postCount, _description, _user, block.timestamp);
        // Trigger an event
        emit PostCreated(
            postCount,
            _description,
            _user,
            block.timestamp
        );
    }
    function addFileToPost(File memory _files, uint256 _postId) private {
        require(bytes(_files.hash).length > 0);
        require(bytes(_files.fileType). length > 0);
        filesCount++;
        _files.postId = _postId;
        
        files[_postId].push(_files);
    }
    function deletePost(uint256 id) public {
        delete posts[id];
    }
    function commentPost(uint256 _id, string memory _comment, User memory user)
        public
        payable
    {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount);
       //Adding new comment
        commentCount++;
        comments[commentCount] = Comment(user, _comment, _id, commentCount, block.timestamp);
        emit PostCommented(
            commentCount,
            _id,
            _comment,
            user,
            block.timestamp
        );
    }
    function deleteComment(uint256 id) public {
        delete comments[id];
    }
    function getPostComments(uint256 postId) public view returns (Comment[] memory) {
        require(postId > 0 && postId <= postCount);
        Comment[] memory _cList = new Comment[](commentCount);
        for (uint i = 0; i < commentCount; i++){
            if (postId == comments[i+1].postId){
                _cList[i]= comments[i+1];
            }
        }
        return _cList;
    }
    function setLike(uint256 postId, User memory user) public payable {
        require(postId > 0 && postId <= postCount);
        Like[] memory _lList = getPostLikes(postId);
        for (uint i = 0; i < _lList.length; i++){
            require(keccak256(abi.encodePacked(user.account)) != keccak256(abi.encodePacked(_lList[i].user.account)));
        }
        likesCount++;
        likes[likesCount] = Like(postId, user);
        emit PostLiked(postId, user);
    }
    function unLike(uint256 postId, User memory user) public {
        require(postId > 0 && postId <= postCount);
        for (uint i = 0; i < likesCount; i++){
            if (likes[i+1].postId == postId && keccak256(abi.encodePacked(user.account)) == keccak256(abi.encodePacked(likes[i+1].user.account)) ) {
                delete likes[i+1];
            }
        }
        emit PostUnLiked(postId, user);
    }

    function getPosts() public  view returns (AllPostInfo[] memory) {
        AllPostInfo[] memory allPost = new AllPostInfo[](postCount);

        for (uint i = 0; i < postCount; i++) {
            allPost[i].post = posts[i+1];
            allPost[i].comments = getPostComments(i+1);
            allPost[i].likes = getPostLikes(i+1);
            allPost[i].files = getPostFiles(i+1);
        }
        return allPost;
    }
    function getPost(uint256 postId) public view returns (AllPostInfo memory) {
        AllPostInfo memory _post;
        _post.post = posts[postId];
        _post.comments = getPostComments(postId);
        _post.likes = getPostLikes(postId);
        _post.files = getPostFiles(postId);
        return _post;
    }
    function getPostsByUserAddress(address _account) public view returns (AllPostInfo[] memory){
        AllPostInfo[] memory allPost = new AllPostInfo[](postCount);
        for (uint i = 0; i < postCount; i++) {
            if (posts[i+1].author.account == _account){
                allPost[i].post = posts[i+1];
                allPost[i].comments = getPostComments(i+1);
                allPost[i].likes = getPostLikes(i+1);
                allPost[i].files = getPostFiles(i+1);
            }
        }
        return allPost;
    }
    function getPostLikes(uint256 postId) public view returns (Like[] memory) {
        Like[] memory postLikes = new Like[](likesCount);
        for (uint i = 0; i < likesCount; i++){
            if (postId == likes[i+1].postId){
                postLikes[i]= likes[i+1];
            }
        }
        return postLikes;
    }
    function getPostFiles(uint256 _postId) public view returns (File[] memory){
        File[] memory postFiles = new File[](filesCount);
            if (_postId == files[_postId][0].postId){
                    postFiles = (files[_postId]);            
        }
        return postFiles;
    }
    function follow(uint256 _userId, User memory user) public payable {
        require(_userId > 0 && _userId <= userCount);
        Followed[] memory _lList = getUserFollowed(_userId);
        for (uint i = 0; i < _lList.length; i++){
            require(keccak256(abi.encodePacked(user.account)) != keccak256(abi.encodePacked(_lList[i]._followed.account)));
        }
        followedCount++;
        followed[followedCount] = Followed(_userId, user);
        emit NewFollowed(_userId, user);
    }
    function getUserFollowed(uint256 _userId) public view returns (Followed[] memory) {
        require(_userId > 0 && _userId <= userCount);
        Followed[] memory _followed = new Followed[](followedCount);
        for (uint i = 0; i < _followed.length; i++){
            if (_userId == followed[i+1].followerId){
                _followed[i]= followed[i+1];
            }
        }
        return _followed;
    }
    function getFollowedUsersPosts(uint256 _userId) public view returns (FollowedUserPosts[] memory){
        require(_userId > 0 && _userId <= userCount);
        FollowedUserPosts[] memory _allPosts = new FollowedUserPosts[](postCount);
        Followed[] memory _followed = getUserFollowed(_userId);
        for (uint i= 0; i < _followed.length; i++){
            AllPostInfo[] memory _followedPost = getPostsByUserAddress(_followed[i]._followed.account);
            _allPosts[i]._followedUsersPosts = _followedPost;
        }
        return _allPosts;
    }
}
