package com.iot2ndproject.mobilityhub.global.security;


import com.iot2ndproject.mobilityhub.domain.admin.dao.AdminDAO;
import com.iot2ndproject.mobilityhub.domain.admin.dto.AdminResponseDTO;
import com.iot2ndproject.mobilityhub.domain.admin.dto.UserAdminDetail;
import com.iot2ndproject.mobilityhub.domain.admin.entity.AdminEntity;
import com.iot2ndproject.mobilityhub.domain.user.dao.UserDAO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserResponseDTO;
import com.iot2ndproject.mobilityhub.domain.user.dto.UserUserDetail;
import com.iot2ndproject.mobilityhub.domain.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSecurityDetailService implements UserDetailsService {
    private final AdminDAO adminDAO;
    private final UserDAO userDAO;
    private final ModelMapper modelMapper;


    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        System.out.println("====================");
        System.out.println(id);
        System.out.println("====================");

        if (id.endsWith("admin")) {
            AdminEntity adminEntity = adminDAO.findByAdminId(id);
            System.out.println("adminEntity = " + adminEntity.getAdminId());
            System.out.println("adminEntity = " + adminEntity.getAdminPass());
            if (adminEntity == null) {
                throw new RuntimeException("해당 관리자가 없습니다. 인증실패");
            }

            List<GrantedAuthority> roles = new ArrayList<>();
            roles.add(new SimpleGrantedAuthority(adminEntity.getRole()));

            AdminResponseDTO adminResponseDTO = modelMapper.map(adminEntity, AdminResponseDTO.class);
            adminResponseDTO.setRole(adminEntity.getRole());
            System.out.println("adminLoginResponse = " + adminResponseDTO.getAdminId());
            System.out.println("adminLoginResponse = " + adminResponseDTO.getAdminPass()  );
            UserAdminDetail adminDetail = new UserAdminDetail(adminResponseDTO, roles);

            return adminDetail;

        }else{
            UserEntity userEntity = userDAO.findById(id);

            if(userEntity==null){
                throw new RuntimeException("사용자가 없습니다. 인증실패");
            }

            List<GrantedAuthority> roles = new ArrayList<>();
            roles.add(new SimpleGrantedAuthority(userEntity.getRole()));
            UserResponseDTO userResponseDTO = modelMapper.map(userEntity, UserResponseDTO.class);
            userResponseDTO.setRole(userEntity.getRole());

            UserUserDetail userDetail = new UserUserDetail(userResponseDTO,roles);

            return userDetail;
        }
    }
}
