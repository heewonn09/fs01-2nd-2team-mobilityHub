package com.iot2ndproject.mobilityhub.domain.carwash.service;

import com.iot2ndproject.mobilityhub.domain.carwash.dto.WashResponse;

import java.util.List;

public interface CarWashService {

    List<WashResponse> findAll();

}
