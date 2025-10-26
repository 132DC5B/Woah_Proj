# ²��
Woah_Proj �O�@�ӥH Express + Socket.IO ����¦���Y�ɲ�ѥܽd�]�e�ݩ�b public/�A���A���� server.js�^�C���M�פw�]�p���ݹ�ݥ[�K�]E2EE�^�[�c�G�T���b�Τ�ݥ[�K��~�e�X�A���A���ȧ@�����~�P�[�K�r�ꪺ�x�s�P�s���C

# �B�@��z
- ���_�P�[�K�Ҧ�  
  - �Τ�ݥ�����ʿ�J�ۦP����٪��_�]�γq��X�^�C�u����ݨϥάۦP���_�ɡA�~�ब�۸ѱK�þ\Ū�T���C  

- �T���y�{  
  1. �ϥΪ̦b�e�ݿ�J�T���åH��ʳ]�w�����_�i��[�K�A���� encryptedMsg�]�r��^�C  
  2. �e�ݳz�L Socket.IO �o�e�ƥ� "chat message"�A�ѼƬ� encryptedMsg�C  
  3. ���A���]server.js�^���� encryptedMsg�G  
     - �H����覡���[�� chat.txt �@�������]�C��@�h�[�K�r��^�C  
     - �ϥ� io.emit("chat message", encryptedMsg) �s�����Ҧ��s�u�� client�]���A�����|���ոѱK�^�C  
  4. ��L�Τ�ݦ���s����A�ϥΥ��a��J�����_���ոѱK����ܩ���]�Y���_���ǰt�h�L�k�ѱK�^�C

- ���v�T���]GET /messages�^  
  - ���A������ GET /messages�A�|Ū�� chat.txt�B������Ψæ^�� JSON { messages: [...] }�A�^�Ǫ������[�K�r��A�Ȥ�ݭt�d�ѱK�C

- ���A���欰�P���p
  - ���A���|�O���s�u��l IP�]�q socket handshake ���o�^�A�åä[�μȮɫO�s�[�K�r��]chat.txt�^�C  
  - ���A���ݤ������κ޲z�Τ�ݪ��_�A�B���|�b�ثe��@���ѱK�T���F�]�����K�ʪ��֤ߨ̿��Τ�ݪ����_�w���P�洫�覡�C

- ���I�P��ĳ  
  - ���_���ɡG��ʿ�J���_�ݳz�L�w�������u�Ψ��H�q�D�]OOB�^���ɡA�קK�b���}��D�ǰe���_�C   
  - �ǿ�w���G���p�ɽаȥ��ϥ� HTTPS/TLS �H�O�@ WebSocket �P API ���|���ǿ����p�C  
  - �x�s�w���Gchat.txt ���O�s�������[�K�r��A���Y���_�~���A���v�T���N�i�Q�ѱK�F���ݨD�Ҽ{�[�j�x�s�ݥ[�K���Y�u�O�d�����C

# �̮ۨM��]�Ӧ� package.json�^
- express (^5.1.0)
- socket.io (^4.8.1)
- ws (^8.18.3)
- body-parser (^2.2.0)
- fs (^0.0.1-security)

scripts:
- start: node server.js

# �ֳt�}�l�]�����^
1. Clone �ܮw
   git clone https://github.com/132DC5B/Woah_Proj.git
   cd Woah_Proj

2. �w�ˬ̮ۨM��
   npm install

3. �Ұʦ��A��
   npm start

4. �}���s����
   http://localhost:3000
   �]server.js �ثe�w�]��ť 3000�^