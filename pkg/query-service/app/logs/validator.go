package logs

import (
	"fmt"
	"regexp"

	"go.signoz.io/query-service/constants"
	"go.signoz.io/query-service/model"
)

func ValidateUpdateFieldPayload(field *model.UpdateField) error {
	if field.Name == "" {
		return fmt.Errorf("name cannot be empty")
	}
	if field.Type == "" {
		return fmt.Errorf("type cannot be empty")
	}
	if field.DataType == "" {
		return fmt.Errorf("dataType cannot be empty")
	}

	matched, err := regexp.MatchString(fmt.Sprintf("^(%s|%s|%s)$", constants.Static, constants.Attributes, constants.Resources), field.Type)
	if err != nil {
		return err
	}
	if !matched {
		return fmt.Errorf("type %s not supported", field.Type)
	}

	if field.IndexType != nil {
		matched, err := regexp.MatchString(`^(minmax|set\([0-9]\)|bloom_filter\((0?.?[0-9]+|1)\)|tokenbf_v1\([0-9]+,[0-9]+,[0-9]+\)|ngrambf_v1\([0-9]+,[0-9]+,[0-9]+,[0-9]+\))$`, *field.IndexType)
		if err != nil {
			return err
		}
		if !matched {
			return fmt.Errorf("index type %s not supported", *field.IndexType)
		}
	}
	return nil
}
